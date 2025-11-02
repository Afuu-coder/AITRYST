"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, Heart, Star, ArrowLeft } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function MicrositePage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<any>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    // Try to load product from localStorage
    const savedProduct = localStorage.getItem(`microsite_${id}`)
    if (savedProduct) {
      setProduct(JSON.parse(savedProduct))
    } else {
      // Fallback demo product
      setProduct({
        name: 'Handcrafted Product',
        description: 'This is a beautiful handcrafted product created by skilled artisans. Each piece is unique and made with traditional techniques.',
        price: '1500',
        artisan: 'Artisan',
        category: 'Handcrafted Product',
        material: 'Ceramic Clay',
        dimensions: '8" x 6" x 6"',
        rating: 4.8,
        reviews: 24,
        phone: '',
        image: '/placeholder-product.jpg'
      })
    }
  }, [id])

  const handleWhatsAppOrder = () => {
    if (product?.phone) {
      const message = encodeURIComponent(`Hi! I'm interested in ordering ${product.name} (₹${product.price})`)
      window.open(`https://wa.me/${product.phone}?text=${message}`, '_blank')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Handcrafted Product',
          text: product?.description || 'Check out this amazing handcrafted product!',
          url: url
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/studio" className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Studio
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100">
            {product.image && product.image !== '/placeholder-product.jpg' ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎨</div>
                  <p className="text-sm">Handcrafted Product</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.artisan}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-bold text-purple-600">₹{product.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Product Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Artisan</p>
                  <p className="font-medium">{product.artisan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium">{product.material}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="font-medium">{product.dimensions}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
                onClick={handleWhatsAppOrder}
                disabled={!product.phone}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Order via WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="text-center pt-4 border-t">
              <Badge variant="secondary" className="text-sm">
                ✓ 100% Handcrafted • ✓ Authentic Artisan Work • ✓ Secure Payment
              </Badge>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by AITRYST - Empowering Artisans</p>
        </div>
      </div>
    </div>
  )
}
