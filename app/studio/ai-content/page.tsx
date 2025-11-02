'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, Copy, Check, Sparkles, X, Download, Mic, Palette, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppShell from '@/components/app-shell';
import toast from 'react-hot-toast';
// Type definition for the output
type GenerateProductDetailsOutput = {
  productTitle: string;
  descriptionEn: string;
  descriptionHi: string;
  marketingCaption: string;
  hashtags: string[];
  suggestedPlatforms: string[];
  engagementScore: number;
  imageMockups: Array<{
    variation: 'lifestyle' | 'human_interaction' | 'poster';
    url: string;
  }>;
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
];

const categories = [
  'Pottery',
  'Jewelry',
  'Textile',
  'Home Decor',
  'Woodwork',
  'Painting',
  'Other'
];

const platforms = [
  { value: 'instagram', label: 'Instagram', icon: '📸' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'etsy', label: 'Etsy', icon: '🛍️' },
];

const brandTones = [
  { value: 'traditional', label: 'Traditional', icon: '🏛️' },
  { value: 'royal', label: 'Royal', icon: '👑' },
  { value: 'eco-friendly', label: 'Eco-Friendly', icon: '🌿' },
  { value: 'luxury', label: 'Luxury', icon: '💎' },
  { value: 'playful', label: 'Playful', icon: '🎨' },
  { value: 'minimal-modern', label: 'Minimal Modern', icon: '⚪' },
];

export default function AIContentStudio() {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [voiceNote, setVoiceNote] = useState<File | null>(null);
  const [voiceNotePreview, setVoiceNotePreview] = useState<string | null>(null);
  const [productCategory, setProductCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'bn' | 'te'>('en');
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'whatsapp' | 'facebook' | 'etsy'>('instagram');
  const [selectedBrandTone, setSelectedBrandTone] = useState<'traditional' | 'royal' | 'eco-friendly' | 'luxury' | 'playful' | 'minimal-modern'>('traditional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GenerateProductDetailsOutput | null>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProductImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleVoiceNoteUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please select an audio file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Audio size should be less than 10MB');
        return;
      }
      
      setVoiceNote(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setVoiceNotePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Voice note uploaded successfully!');
    }
  };

  const removeImage = () => {
    setProductImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Image removed');
  };

  const removeVoiceNote = () => {
    setVoiceNote(null);
    setVoiceNotePreview(null);
    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
    toast.success('Voice note removed');
  };

  const generateContent = async () => {
    if (!productImage) {
      toast.error('Please upload a product image');
      return;
    }

    if (!productCategory) {
      toast.error('Please select a product category');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      // Convert image to data URI
      const imageReader = new FileReader();
      imageReader.onload = async (e) => {
        const photoDataUri = e.target?.result as string;

        // Convert voice note to data URI if exists
        let voiceNoteDataUri: string | undefined;
        if (voiceNote) {
          const audioReader = new FileReader();
          audioReader.onload = async (audioEvent) => {
            voiceNoteDataUri = audioEvent.target?.result as string;
            await processGeneration(photoDataUri, voiceNoteDataUri);
          };
          audioReader.readAsDataURL(voiceNote);
        } else {
          await processGeneration(photoDataUri);
        }
      };
      imageReader.readAsDataURL(productImage);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate marketing kit');
      setIsGenerating(false);
    }
  };

  const processGeneration = async (photoDataUri: string, voiceNoteDataUri?: string) => {
    try {
      toast.success('Generating marketing content with AI...');
      
      // Call the API route instead of directly calling the Genkit flow
      const apiResponse = await fetch('/api/generate-product-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoDataUri,
          voiceNoteDataUri,
          language: selectedLanguage,
          productCategory: productCategory.toLowerCase(),
          platform: selectedPlatform,
          brandTone: selectedBrandTone,
        }),
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || 'API request failed');
      }
      
      const result: GenerateProductDetailsOutput = await apiResponse.json();

      // Image mockups are already generated by the backend with Gemini 2.5 Flash Image Preview
      // No need for additional enhancement
      setGeneratedContent(result);

      toast.success('Marketing kit generated successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(prev).add(label));
      toast.success(`${label} copied!`);
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(label);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  return (
    <AppShell currentPage="studio">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-500" />
            AI Marketing Studio
          </h1>
          <p className="text-lg text-muted-foreground">
            KalaSahayak - Your AI-powered marketing assistant for artisan products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Product Details
              </h2>
              
              {/* Image Upload */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium">Product Image *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <Image 
                          src={imagePreview} 
                          alt="Product preview" 
                          width={300}
                          height={300}
                          className="rounded-lg object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Upload Product Image</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Voice Note Upload */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Voice Note (Optional)
                </Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {voiceNotePreview ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <Mic className="w-8 h-8 text-blue-500" />
                        <div className="text-left">
                          <p className="font-medium">Voice note uploaded</p>
                          <p className="text-sm text-muted-foreground">{voiceNote?.name}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={removeVoiceNote}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Mic className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-sm text-muted-foreground">Record or upload your voice describing the product</p>
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleVoiceNoteUpload}
                        className="hidden"
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => audioInputRef.current?.click()}
                      >
                        Upload Voice Note
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium">Product Category *</Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selection */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium">Language</Label>
                <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Selection */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Target Platform
                </Label>
                <Select value={selectedPlatform} onValueChange={(value: any) => setSelectedPlatform(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.icon} {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Tone Selection */}
              <div className="space-y-4 mb-6">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Brand Tone
                </Label>
                <Select value={selectedBrandTone} onValueChange={(value: any) => setSelectedBrandTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {brandTones.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.icon} {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Full Marketing Kit
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Right Side - Results */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Generated Content</h2>

              {!generatedContent && !isGenerating && (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Your AI-generated marketing content will appear here
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-medium">KalaSahayak is creating your marketing kit...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Analyzing image, generating content, and enhancing mockups
                  </p>
                </div>
              )}

              {generatedContent && (
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">📝 Text Content</TabsTrigger>
                    <TabsTrigger value="images">🖼️ Image Mockups</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-6 mt-6">
                    {/* Product Title */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-medium">Product Title</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.productTitle, 'Title')}
                        >
                          {copiedItems.has('Title') ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-semibold">{generatedContent.productTitle}</p>
                      </div>
                    </div>

                    {/* Product Description - Show only in selected language */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-medium">
                          Product Description ({selectedLanguage === 'en' ? 'English' : 
                                               selectedLanguage === 'hi' ? 'Hindi' :
                                               selectedLanguage === 'bn' ? 'Bengali' : 'Telugu'})
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(
                            selectedLanguage === 'en' ? generatedContent.descriptionEn : generatedContent.descriptionHi, 
                            'Description'
                          )}
                        >
                          {copiedItems.has('Description') ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={selectedLanguage === 'en' ? generatedContent.descriptionEn : generatedContent.descriptionHi}
                        readOnly
                        className="min-h-[100px] bg-muted"
                      />
                    </div>

                    {/* Marketing Caption */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-medium">Marketing Caption</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.marketingCaption, 'Caption')}
                        >
                          {copiedItems.has('Caption') ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={generatedContent.marketingCaption}
                        readOnly
                        className="min-h-[80px] bg-muted"
                      />
                    </div>

                    {/* Hashtags */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-medium">Hashtags</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.hashtags.join(' '), 'Hashtags')}
                        >
                          {copiedItems.has('Hashtags') ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                        {generatedContent.hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Platforms */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">Suggested Platforms</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                        {generatedContent.suggestedPlatforms.map((platform, i) => (
                          <Badge key={i} variant="outline">{platform}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Engagement Score */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">Engagement Score</Label>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                        <p className="text-4xl font-bold text-blue-600">
                          {generatedContent.engagementScore}
                          <span className="text-lg text-muted-foreground">/10</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          AI-predicted engagement potential
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="mt-6">
                    <div className="grid grid-cols-1 gap-6">
                      {generatedContent.imageMockups.map((mockup, index) => (
                        <div key={index} className="space-y-3">
                          <div className="relative aspect-square rounded-lg overflow-hidden border">
                            <Image
                              src={mockup.url}
                              alt={mockup.variation}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {mockup.variation === 'lifestyle' && 'Lifestyle'}
                                {mockup.variation === 'human_interaction' && 'Human Interaction'}
                                {mockup.variation === 'poster' && 'Poster'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {mockup.variation === 'lifestyle' && 'Product in real-world setting'}
                                {mockup.variation === 'human_interaction' && 'Person using the product'}
                                {mockup.variation === 'poster' && 'Marketing poster style'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadImage(mockup.url, `${mockup.variation}.png`)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
