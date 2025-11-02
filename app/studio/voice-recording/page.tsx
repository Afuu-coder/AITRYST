"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Loader2, 
  Volume2, 
  Upload, 
  FileAudio,
  Sparkles,
  Edit3,
  Copy,
  Check,
  RefreshCw,
  Download,
  Zap,
  MessageSquare,
  Instagram,
  ShoppingCart,
  Globe,
  X,
  FileText
} from "lucide-react"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface GeneratedContent {
  title: string
  description: string
}

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  duration?: number
}

export default function VoiceRecording() {
  // Recording states
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  // Content states
  const [transcription, setTranscription] = useState("")
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [editableContent, setEditableContent] = useState<GeneratedContent | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentStep, setCurrentStep] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const { transcribeAudioFile } = useBackendContext()

  const languages = [
    { code: "hindi", name: "हिंदी (Hindi)", flag: "🇮🇳", apiCode: "hi-IN" },
    { code: "bengali", name: "বাংলা (Bengali)", flag: "🇧🇩", apiCode: "bn-IN" },
    { code: "telugu", name: "తెలుగు (Telugu)", flag: "🇮🇳", apiCode: "te-IN" },
    { code: "english", name: "English", flag: "🇺🇸", apiCode: "en-US" },
  ]

  const startRecording = useCallback(async () => {
    try {
      // Reset previous states
      setTranscription("")
      setGeneratedContent(null)
      setEditableContent(null)
      setProcessingSteps([])
      setCurrentStep(0)
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const recordedMimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunks, { type: recordedMimeType })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording()
            return 60
          }
          return prev + 1
        })
      }, 1000)
      
      toast.success("🎤 Recording started! Speak clearly for best results.")
    } catch (error) {
      toast.error("Could not access microphone. Please check permissions.")
      console.error("Microphone access error:", error)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      toast.success("🎵 Recording completed! Ready for transcription.")
    }
  }, [isRecording])

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error("Please select a valid audio file")
      return
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Audio file size must be less than 25MB")
      return
    }

    const url = URL.createObjectURL(file)
    setAudioBlob(file)
    setAudioUrl(url)
    setRecordingTime(Math.floor(file.size / 10000)) // Approximate duration
    
    // Reset previous results
    setTranscription("")
    setGeneratedContent(null)
    setEditableContent(null)
    setProcessingSteps([])
    setCurrentStep(0)
    
    toast.success("Audio file uploaded successfully!")
  }

  const transcribeAndGenerate = useCallback(async () => {
    if (!audioBlob) {
      toast.error("No audio file to transcribe")
      return
    }

    // Initialize processing steps
    const steps: ProcessingStep[] = [
      { id: 'transcribe', name: 'Transcribing Audio', status: 'processing' },
      { id: 'generate', name: 'Generating Content', status: 'pending' },
      { id: 'complete', name: 'Finalizing', status: 'pending' }
    ]
    setProcessingSteps(steps)
    setIsTranscribing(true)
    setCurrentStep(0)

    try {
      // Step 1: Transcribe audio
      const startTime = Date.now()
      const selectedLang = languages.find(lang => lang.code === selectedLanguage)
      const languageCode = selectedLang?.apiCode || 'en-US'
      
      // Create FormData for the API call
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('language', languageCode)
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result || !result.transcription) {
        throw new Error("Failed to get transcription")
      }
      
      setTranscription(result.transcription)
      steps[0].status = 'completed'
      steps[0].duration = Date.now() - startTime
      setProcessingSteps([...steps])
      setCurrentStep(1)
      
      toast.success("🎯 Audio transcribed successfully!")
      
      // Step 2: Use generated product content from API
      setIsGenerating(true)
      steps[1].status = 'processing'
      setProcessingSteps([...steps])
      
      const contentStartTime = Date.now()
      
      // Use the product content generated by the API
      if (!result.productContent) {
        throw new Error("No product content generated by Google Cloud services")
      }
      
      const generatedContent = {
        title: result.productContent.title,
        description: result.productContent.description
      }
      
      steps[1].status = 'completed'
      steps[1].duration = Date.now() - contentStartTime
      steps[2].status = 'completed'
      setProcessingSteps([...steps])
      setCurrentStep(2)
      
      setGeneratedContent(generatedContent)
      setEditableContent(generatedContent)
      
      toast.success("✨ Product descriptions generated successfully!")
      
    } catch (error) {
      const errorStep = steps.find(step => step.status === 'processing')
      if (errorStep) {
        errorStep.status = 'error'
        setProcessingSteps([...steps])
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast.error(`Failed to process audio: ${errorMessage}`)
      console.error("Processing error:", error)
    } finally {
      setIsTranscribing(false)
      setIsGenerating(false)
    }
  }, [audioBlob, selectedLanguage])


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set([...prev, type]))
      toast.success(`${type} copied to clipboard!`)
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(type)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast.error("Failed to copy to clipboard")
    }
  }

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  const resetAll = () => {
    setTranscription("")
    setGeneratedContent(null)
    setEditableContent(null)
    setProcessingSteps([])
    setCurrentStep(0)
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setCopiedItems(new Set())
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mic className="w-8 h-8 text-blue-500" />
              <h1 className="text-5xl font-heading text-craft-primary">Voice to Product Stories</h1>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-6">
              Record your product description in your native language and watch AI transform it into compelling content for Instagram, WhatsApp, Amazon, and your website.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
                🎤 Voice Recording
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2">
                🗣️ Multi-Language
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
                ✨ AI Content Generation
              </Badge>
            </div>
          </div>

          {/* Main Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Recording */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Mic className="w-6 h-6 text-blue-500" />
                  Record Your Product Story
                </h2>

                {/* Language Selection */}
                <div className="space-y-2">
                  <Label className="text-lg font-medium">Select Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose your language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Recording Interface */}
                <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-xl hover:border-primary/50 transition-all duration-300">
                  <div className="relative mb-8">
                    <Button
                      size="lg"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-32 h-32 rounded-full text-white shadow-2xl transition-all duration-300 ${
                        isRecording 
                          ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse shadow-red-500/50" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/50"
                      }`}
                    >
                      {isRecording ? <Square className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
                    </Button>

                    {isRecording && (
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-mono shadow-lg">
                          {formatTime(recordingTime)}
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    {isRecording ? "🎤 Recording in progress..." : "🎯 Ready to record"}
                  </h3>
                  <p className="text-foreground/70 mb-6">
                    {isRecording ? "Tap the button to stop recording" : "Tap to start recording (60s max)"}
                  </p>

                  {/* Enhanced Animated waveform */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 h-16 mb-6">
                      {[...Array(35)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 50 + 10}px`,
                            animationDelay: `${i * 0.03}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Upload audio option */}
                  <div className="border-t pt-6 mt-6">
                    <p className="text-sm text-foreground/70 mb-4">Or upload an audio file</p>
                    <div>
                      <Input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        id="audio-upload"
                      />
                      <Label htmlFor="audio-upload">
                        <Button variant="outline" asChild className="h-12 px-6">
                          <span className="cursor-pointer">
                            <Upload className="w-5 h-5 mr-2" />
                            Upload Audio File
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Audio Playback */}
                {audioUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <Button size="sm" variant="outline" onClick={playAudio} className="h-10 w-10">
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                          <Volume2 className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold">Recorded Audio</span>
                          <Badge variant="secondary">{formatTime(recordingTime)}</Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={transcribeAndGenerate}
                      disabled={isTranscribing || isGenerating}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {isTranscribing || isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                          {isTranscribing ? "Transcribing..." : "Generating Content..."}
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 mr-3" />
                          Transcribe & Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Right Side - Results */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-green-500" />
                  Generated Content
                </h2>

                {!transcription ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Mic className="w-12 h-12 text-green-500" />
                      <h2 className="text-3xl font-heading text-craft-primary">Ready for Magic</h2>
                      <Sparkles className="w-12 h-12 text-purple-500" />
                    </div>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                      Record your product description and watch AI transform it into compelling content for all platforms with voice-to-text technology.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>🎤</div>
                        <h3 className="font-semibold text-green-700 mb-2">Voice Recording</h3>
                        <p className="text-sm text-green-600">Record up to 60 seconds in Hindi, Bengali, Telugu, or English</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>📝</div>
                        <h3 className="font-semibold text-blue-700 mb-2">AI Transcription</h3>
                        <p className="text-sm text-blue-600">Google Cloud Speech-to-Text converts your voice to accurate text</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-3" suppressHydrationWarning>✨</div>
                        <h3 className="font-semibold text-purple-700 mb-2">Content Generation</h3>
                        <p className="text-sm text-purple-600">AI creates platform-specific marketing content from your description</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h3 className="font-semibold text-green-700 mb-3">How it works:</h3>
                      <div className="flex justify-center gap-8 text-sm text-green-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>1</div>
                          <span>Record or upload audio</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>2</div>
                          <span>AI transcribes speech</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold" suppressHydrationWarning>3</div>
                          <span>Generate content</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Processing Steps */}
                    {processingSteps.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Processing Steps</h3>
                        <div className="space-y-2">
                          {processingSteps.map((step, index) => (
                            <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              step.status === 'completed' ? 'bg-green-50 border border-green-200' :
                              step.status === 'processing' ? 'bg-blue-50 border border-blue-200' :
                              step.status === 'error' ? 'bg-red-50 border border-red-200' :
                              'bg-gray-50 border border-gray-200'
                            }`}>
                              {getStepIcon(step.status)}
                              <span className="font-medium text-sm">{step.name}</span>
                              {step.duration && (
                                <span className="text-xs text-foreground/60 ml-auto">
                                  {(step.duration / 1000).toFixed(1)}s
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transcription */}
                    <div className="space-y-3">
                      <Label className="text-lg font-medium">Transcription</Label>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{transcription}</p>
                      </div>
                    </div>

                    {/* Generated Content */}
                    {editableContent && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Product Information</h3>
                          <Button variant="outline" size="sm" onClick={resetAll}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Start Over
                          </Button>
                        </div>

                        {/* Product Title */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <Label className="font-medium">Product Title</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(editableContent.title, 'Product Title')}
                            >
                              {copiedItems.has('Product Title') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          <Input
                            value={editableContent.title}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, title: e.target.value} : null)}
                            className="text-lg font-semibold"
                            placeholder="Enter product title..."
                          />
                        </div>

                        {/* Product Description */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            <Label className="font-medium">Product Description</Label>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(editableContent.description, 'Product Description')}
                            >
                              {copiedItems.has('Product Description') ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          <Textarea
                            value={editableContent.description}
                            onChange={(e) => setEditableContent(prev => prev ? {...prev, description: e.target.value} : null)}
                            className="min-h-[120px] resize-none text-base"
                            placeholder="Enter product description..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </AppShell>
  )
}