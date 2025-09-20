"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { QrCode, Copy, Check, ExternalLink, MessageCircle, Share2, Loader2, Download, Sparkles, Smartphone, Globe, Zap, Upload, X, Image } from "lucide-react"
import { useBackendContext } from "@/components/BackendProvider"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function QRMicrosite() {
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [artisanPhone, setArtisanPhone] = useState("") // New field for artisan's phone
  const [productImage, setProductImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [micrositeUrl, setMicrositeUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { generateProductQRCode } = useBackendContext()

  useEffect(() => {
    // Load artisan phone from localStorage or set default
    const savedPhone = localStorage.getItem("artisanPhone") || ""
    setArtisanPhone(savedPhone)
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      
      setProductImage(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      toast.success('Image uploaded successfully!')
    }
  }

  const removeImage = () => {
    setProductImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Image removed')
  }

  const handleGenerateQR = async () => {
    if (!productName || !productDescription || !productPrice) {
      toast.error("Please fill all fields")
      return
    }

    if (!artisanPhone) {
      toast.error("Please enter your WhatsApp number")
      return
    }

    // Save artisan phone to localStorage
    localStorage.setItem("artisanPhone", artisanPhone)

    setIsGenerating(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('productName', productName)
      formData.append('productDescription', productDescription)
      formData.append('productPrice', productPrice)
      formData.append('artisanPhone', artisanPhone)
      
      if (productImage) {
        formData.append('productImage', productImage)
      }

      // Create product using Google Cloud services
      const response = await fetch('/api/create-product', {
        method: 'POST',
        body: formData, // Use FormData instead of JSON for file upload
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setQrCodeUrl(result.qrCodeUrl)
        setMicrositeUrl(result.micrositeUrl)
        setWhatsappLink(result.whatsappLink)
        
        toast.success("🎉 QR Microsite created successfully with Google Cloud!")
      } else {
        throw new Error(result.error || 'Failed to create product')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to generate QR Microsite: ${errorMessage}`)
      console.error("QR generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const shareViaWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, "_blank")
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      // Create a temporary link to download the QR code
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `${productName.replace(/\s+/g, '_')}_QR_Code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <QrCode className="w-8 h-8 text-blue-500" />
              <h1 className="text-5xl font-heading text-craft-primary">QR Microsite Generator</h1>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-6">
              Create instant product webpages with QR codes for easy sharing. Customers can scan and order directly via WhatsApp with Google Cloud-powered infrastructure.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2">
                📱 QR Code Generation
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
                🌐 Instant Webpages
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
                💬 WhatsApp Integration
              </Badge>
            </div>
          </div>

          {/* Main Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Product Form */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-blue-500" />
                  Product Details
                </h2>

                {/* Product Information Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName" className="text-lg font-medium">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="Handcrafted Pottery Vase"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-foreground/70">Enter a descriptive name for your product</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productDescription" className="text-lg font-medium">Product Description</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="Describe your product in detail..."
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={4}
                      className="text-lg"
                    />
                    <p className="text-sm text-foreground/70">Detailed description helps customers understand your product</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productImage" className="text-lg font-medium">Product Photo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Product preview"
                              className="w-32 h-32 object-cover rounded-lg mx-auto"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-green-600 font-medium">Image uploaded successfully!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Upload a product photo</p>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-10"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Image
                            </Button>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="productImage"
                      />
                    </div>
                    <p className="text-sm text-foreground/70">Upload a high-quality image of your product (max 5MB)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productPrice" className="text-lg font-medium">Product Price (₹)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        placeholder="1500"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="h-12 text-lg"
                      />
                      <p className="text-sm text-foreground/70">Set your selling price</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="artisanPhone" className="text-lg font-medium">WhatsApp Number</Label>
                      <Input
                        id="artisanPhone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={artisanPhone}
                        onChange={(e) => setArtisanPhone(e.target.value)}
                        className="h-12 text-lg"
                      />
                      <p className="text-sm text-foreground/70">For direct customer orders</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateQR}
                  disabled={isGenerating}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Generating QR Microsite...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 mr-3" />
                      Generate QR Microsite
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Right Side - Results or Ready State */}
            <Card className="p-8">
              <div className="space-y-6">
                {qrCodeUrl && micrositeUrl ? (
                  <>
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                      <Globe className="w-6 h-6 text-blue-500" />
                      Your QR Microsite
                    </h2>

                    {/* QR Code - Hero Display */}
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-700 mb-4">📱 Your QR Code</h3>
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          width={200} 
                          height={200} 
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <Button 
                        onClick={downloadQRCode}
                        variant="outline"
                        className="mb-4"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                      <p className="text-sm text-blue-600">
                        Customers can scan this to view your product
                      </p>
                    </div>

                    {/* Microsite URL */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-500" />
                        Microsite URL
                      </h4>
                      <div className="flex gap-2">
                        <Input 
                          value={micrositeUrl} 
                          readOnly 
                          className="flex-1 text-sm"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(micrositeUrl)}
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Button 
                        onClick={() => window.open(micrositeUrl, "_blank")}
                        className="w-full mt-3"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Microsite
                      </Button>
                    </Card>

                    {/* WhatsApp Integration */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        WhatsApp Integration
                      </h4>
                      <div className="flex gap-2 mb-3">
                        <Input 
                          value={whatsappLink || ""} 
                          readOnly 
                          className="flex-1 text-sm"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={shareViaWhatsApp}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={shareViaWhatsApp}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share via WhatsApp
                      </Button>
                    </Card>

                    {/* Features */}
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700">
                        <Zap className="w-5 h-5" />
                        Microsite Features
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-purple-700">Mobile-optimized product page</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-purple-700">High-quality product images</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-purple-700">Direct WhatsApp ordering</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-100">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-purple-700">Google Cloud powered infrastructure</span>
                        </div>
                      </div>
                    </Card>
                  </>
                ) : (
                  /* Ready State - Similar to Smart Pricing */
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <QrCode className="w-12 h-12 text-blue-500" />
                      <h2 className="text-3xl font-heading text-craft-primary">Ready for QR Magic</h2>
                      <Sparkles className="w-12 h-12 text-purple-500" />
                    </div>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                      Enter your product details and watch AI create an instant webpage with QR code for easy sharing and direct customer orders.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3">📱</div>
                        <h3 className="font-semibold text-blue-700 mb-2">QR Code Generation</h3>
                        <p className="text-sm text-blue-600">Generate high-quality QR codes using Google Cloud services</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3">🌐</div>
                        <h3 className="font-semibold text-green-700 mb-2">Instant Webpages</h3>
                        <p className="text-sm text-green-600">Create mobile-optimized product pages instantly</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-3">💬</div>
                        <h3 className="font-semibold text-purple-700 mb-2">WhatsApp Integration</h3>
                        <p className="text-sm text-purple-600">Direct customer orders via WhatsApp with pre-filled messages</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-700 mb-3">How it works:</h3>
                      <div className="flex justify-center gap-8 text-sm text-blue-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <span>Enter product details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <span>Generate QR & webpage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <span>Share & get orders</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}