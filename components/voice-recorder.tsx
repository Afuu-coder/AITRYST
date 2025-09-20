"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mic, Square, Play, Pause, Loader2, Volume2, Upload, FileAudio, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface VoiceRecorderProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

const languages = [
  { code: "hindi", name: "हिंदी (Hindi)", flag: "🇮🇳" },
  { code: "bengali", name: "বাংলা (Bengali)", flag: "🇧🇩" },
  { code: "telugu", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "english", name: "English", flag: "🇺🇸" },
]

export function VoiceRecorder({ productData, updateProductData, onNext }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  const { transcribeAudioFile } = useBackendContext()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
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
    } catch (error) {
      toast.error("Could not access microphone")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const transcribeAudio = async () => {
    if (!audioBlob) return

    setIsTranscribing(true)

    try {
      // Transcribe audio using backend service
      const transcription = await transcribeAudioFile(audioBlob)
      
      if (!transcription) {
        throw new Error("Failed to transcribe audio")
      }
      
      updateProductData({ transcription })
      toast.success("Audio transcribed successfully!")
    } catch (error) {
      toast.error("Failed to transcribe audio")
      console.error("Transcription error:", error)
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Voice Recording</h2>
        <p className="text-muted-foreground">Record or upload audio → transcribe → summarize</p>
      </div>

      {/* Language Selection */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium">Select Language</label>
          <Badge variant="secondary">Multi-language support</Badge>
        </div>
        <Select value={productData.language} onValueChange={(value) => updateProductData({ language: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose your language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Recording Interface */}
      <Card className="p-8 text-center">
        {/* Big circular record button */}
        <div className="relative mb-6">
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-24 h-24 rounded-full text-white ${
              isRecording ? "bg-destructive hover:bg-destructive/90 pulse-glow" : "bg-accent hover:bg-accent/90"
            }`}
            disabled={isTranscribing}
          >
            {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </Button>

          {isRecording && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
              <Badge variant="destructive" className="font-mono">
                {formatTime(recordingTime)}
              </Badge>
            </div>
          )}
        </div>

        <p className="text-lg font-medium mb-2">{isRecording ? "Recording in progress..." : "Ready to record"}</p>
        <p className="text-sm text-muted-foreground mb-6">
          {isRecording ? "Tap the button to stop recording" : "Tap to start recording (60s max)"}
        </p>

        {/* Animated waveform during recording */}
        {isRecording && (
          <div className="flex items-center justify-center gap-1 h-12 mb-4">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-accent rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 8}px`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Upload audio option */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-muted-foreground mb-2">Or upload an audio file</p>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Audio
          </Button>
        </div>
      </Card>

      {/* Audio Playback & Actions */}
      {audioUrl && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" onClick={playAudio}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Recorded Audio</span>
                <Badge variant="secondary">{formatTime(recordingTime)}</Badge>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={transcribeAudio}
              disabled={isTranscribing}
              className="bg-accent hover:bg-accent/90"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 pottery-spinner" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Transcribe
                </>
              )}
            </Button>
            <Button size="sm" variant="outline">
              Summarize
            </Button>
          </div>

          <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
        </Card>
      )}

      {/* Transcription Result */}
      {(productData.transcription || audioUrl) && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-accent" />
            <span className="font-medium text-accent">
              {productData.transcription ? "Transcription Complete" : "Audio Ready"}
            </span>
          </div>
          {productData.transcription ? (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed bg-white p-3 rounded border">{productData.transcription}</p>
              <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90">
                Continue to Content Generation
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Audio recorded successfully. Click transcribe or continue to next step.
            </p>
          )}
        </Card>
      )}
    </div>
  )
}