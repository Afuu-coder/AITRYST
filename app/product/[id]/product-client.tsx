"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Share2, Heart, ShoppingCart } from "lucide-react"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/get-product?id=${params.id}`)
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const result = await response.json()
        
        if (result.success) {
          const productData = result.product
          setProduct({
            id: productData.id,
            name: productData.name,
            description: productData.description,
            price: productData.priceINR,
            imageUrl: productData.imageUrl || "https://images.unsplash.com/photo-1500961777889-4860e041249e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
            artisan: "Artisan",
            rating: 4.8,
            reviews: 24,
            category: "Handcrafted Product",
            whatsappLink: productData.whatsappLink,
            views: productData.views
          })
        } else {
          throw new Error(result.error || 'Failed to fetch product')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        // Fallback to mock data if API fails
        const mockProduct = {
          id: params.id,
          name: "Handcrafted Pottery Vase",
          description: "Beautiful handcrafted pottery vase made by skilled artisans using traditional techniques. This unique piece features intricate patterns and a beautiful glaze that catches the light.",
          price: 1500,
          imageUrl: "https://images.unsplash.com/photo-1500961777889-4860e041249e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          artisan: "Rajesh Pottery Works",
          rating: 4.8,
          reviews: 24,
          category: "Pottery & Ceramics"
        }
        setProduct(mockProduct)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])

  const handleWhatsAppOrder = () => {
    if (product?.whatsappLink) {
      window.open(product.whatsappLink, "_blank")
    } else {
      // Fallback to default WhatsApp link
      const phoneNumber = "919876543210"
      const message = `Hi! I'm interested in your ${product?.name}. Price: ₹${product?.price}`
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href
        })
      } catch (error) {
        console.log("Sharing failed", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <AppShell currentPage="product">
        <div className="container-craft section-spacing">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-200 rounded-xl h-96"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2 mt-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentPage="product">
      <div className="container-craft section-spacing">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => window.history.back()}>
              ← Back to Studio
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <Card className="overflow-hidden">
                <img 
                  src={product?.imageUrl} 
                  alt={product?.name}
                  className="w-full h-96 object-cover"
                />
              </Card>
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-heading text-craft-primary mb-2">{product?.name}</h1>
                <p className="text-foreground/70">{product?.artisan}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">₹{product?.price}</div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span>{product?.rating}</span>
                  <span className="text-foreground/50">({product?.reviews} reviews)</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-foreground/80">{product?.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-4">
                <Button 
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700 min-w-[200px]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Order via WhatsApp
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  {liked ? 'Liked' : 'Like'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              
              <Card className="p-4">
                <h4 className="font-medium mb-2">Product Information</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Category</span>
                    <span>{product?.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Artisan</span>
                    <span>{product?.artisan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Material</span>
                    <span>Ceramic Clay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Dimensions</span>
                    <span>8" x 6" x 6"</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Reviews Section */}
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-heading text-craft-primary mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Priya Sharma</div>
                  <div className="flex text-yellow-500">
                    ★★★★★
                  </div>
                </div>
                <p className="text-foreground/80">
                  "Absolutely beautiful vase! The craftsmanship is exceptional and it looks perfect in my living room. 
                  The delivery was also very prompt."
                </p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Amit Patel</div>
                  <div className="flex text-yellow-500">
                    ★★★★☆
                  </div>
                </div>
                <p className="text-foreground/80">
                  "Great quality pottery. The glaze work is really nice. Only minor issue was the packaging could 
                  be better as there was a small chip on the edge."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
