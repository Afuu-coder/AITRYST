"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, Loader2, IndianRupee, Sparkles, TrendingUp, Target, DollarSign } from "lucide-react"
import { useBackendContext } from "@/components/BackendProvider"
import AppShell from "@/components/app-shell"
import toast from "react-hot-toast"

export default function SmartPricing() {
  const [materialCost, setMaterialCost] = useState("")
  const [hoursWorked, setHoursWorked] = useState("")
  const [productType, setProductType] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [pricingData, setPricingData] = useState<any>(null)
  const { calculateProductPricing } = useBackendContext()

  const productTypes = [
    { value: "pottery", label: "Pottery & Ceramics", multiplier: 1.2 },
    { value: "textiles", label: "Textiles & Fabrics", multiplier: 1.5 },
    { value: "jewelry", label: "Jewelry & Accessories", multiplier: 2.0 },
    { value: "woodwork", label: "Woodwork & Furniture", multiplier: 1.3 },
    { value: "metalwork", label: "Metalwork & Brass", multiplier: 1.4 },
    { value: "paintings", label: "Paintings & Art", multiplier: 1.8 },
  ]

  const getProductIcon = (type: string) => {
    const icons: Record<string, string> = {
      pottery: "🏺",
      textiles: "🧵",
      jewelry: "💎",
      woodwork: "🪵",
      metalwork: "⚒️",
      paintings: "🎨"
    }
    return icons[type] || "🎨"
  }

  const handleCalculatePricing = async () => {
    if (!materialCost || !hoursWorked || !productType) {
      toast.error("Please fill all fields")
      return
    }

    setIsCalculating(true)
    try {
      // Use AI to generate more intelligent pricing
      const pricing = await calculateProductPricing(
        Number.parseFloat(materialCost),
        Number.parseFloat(hoursWorked),
        productType
      )
      
      // Enhance with AI recommendations
      const enhancedPricing = {
        ...pricing,
        recommendations: await generateAIRecommendations(
          Number.parseFloat(materialCost),
          Number.parseFloat(hoursWorked),
          productType
        )
      }
      
      setPricingData(enhancedPricing)
      toast.success("Pricing calculated successfully!")
    } catch (error) {
      toast.error("Failed to calculate pricing")
      console.error("Pricing calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  // Generate AI recommendations for pricing
  const generateAIRecommendations = async (materialCost: number, hoursWorked: number, productType: string) => {
    // In a real implementation, this would call an AI service
    // For now, we'll return mock recommendations
    return {
      bestSellingPrice: Math.round(materialCost * 2.5 + hoursWorked * 200),
      competitorAnalysis: "Your price is competitive in the market",
      seasonalAdjustment: "Consider 10% increase during festive seasons",
      bulkDiscount: "Offer 15% discount for orders above 5 units"
    }
  }

  return (
    <AppShell currentPage="studio">
      <div className="container-craft section-spacing">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-8 h-8 text-green-500" />
              <h1 className="text-5xl font-heading text-craft-primary">Smart Pricing Calculator</h1>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-6">
              Calculate optimal pricing for your handcrafted products using AI-powered algorithms that consider market demand, competitor analysis, and seasonal factors.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2">
                🧮 AI-Powered Pricing
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2">
                📊 Market Analysis
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2">
                💰 Profit Optimization
              </Badge>
            </div>
          </div>

          {/* Main Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Input Form */}
            <Card className="p-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-500" />
                  Product Details
                </h2>

                {/* Input Form */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="materialCost" className="text-lg font-medium">Material Cost (₹)</Label>
                    <Input
                      id="materialCost"
                      type="number"
                      placeholder="200"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(e.target.value)}
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-foreground/70">Cost of raw materials and supplies</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hoursWorked" className="text-lg font-medium">Hours Worked</Label>
                    <Input
                      id="hoursWorked"
                      type="number"
                      placeholder="4"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-foreground/70">Time spent crafting the product</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType" className="text-lg font-medium">Product Category</Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select product category" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-3">
                              <span className="text-lg">{getProductIcon(type.value)}</span>
                              <span className="font-medium">{type.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-foreground/70">Choose the type of handcrafted product</p>
                  </div>
                </div>

                <Button
                  onClick={handleCalculatePricing}
                  disabled={isCalculating}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Calculating Optimal Price...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5 mr-3" />
                      Calculate Smart Pricing
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Right Side - Results or Ready State */}
            <Card className="p-8">
              <div className="space-y-6">
                {pricingData ? (
                  <>
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-blue-500" />
                      Pricing Analysis
                    </h2>

                  {/* AI Suggested Price - Hero Display */}
                  <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <h3 className="text-lg font-semibold text-green-700 mb-4">🎯 AI Recommended Price</h3>
                    <div className="text-6xl font-bold text-green-600 flex items-center justify-center gap-2 mb-4">
                      <IndianRupee className="w-12 h-12" />
                      {pricingData.suggestedPrice || 0}
                    </div>
                    {pricingData.recommendations && (
                      <p className="text-lg text-green-600 font-medium">
                        Market Optimized: ₹{pricingData.recommendations.bestSellingPrice}
                      </p>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      Cost Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Materials:</span>
                        <span className="font-semibold text-lg">₹{pricingData.materialCost || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Labor ({hoursWorked}h × ₹150):</span>
                        <span className="font-semibold text-lg">₹{pricingData.laborCost || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Overhead (30%):</span>
                        <span className="font-semibold text-lg">₹{pricingData.overhead || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
                        <span className="font-semibold text-gray-800">Base Cost:</span>
                        <span className="font-bold text-xl text-gray-800">₹{pricingData.materialCost + pricingData.laborCost + pricingData.overhead || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
                        <span className="font-semibold text-green-700">Profit Margin:</span>
                        <span className="font-bold text-xl text-green-600">₹{(pricingData.suggestedPrice || 0) - (pricingData.materialCost + pricingData.laborCost + pricingData.overhead || 0)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Platform Pricing */}
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      Platform-Specific Pricing
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">🏪 Local Market</div>
                        <div className="text-2xl font-bold text-blue-700">₹{pricingData.platformPrices?.local || 0}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center border border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-1">💻 Online Store</div>
                        <div className="text-2xl font-bold text-green-700">₹{pricingData.platformPrices?.online || 0}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium mb-1">⭐ Premium Market</div>
                        <div className="text-2xl font-bold text-purple-700">₹{pricingData.platformPrices?.premium || 0}</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center border border-orange-200">
                        <div className="text-sm text-orange-600 font-medium mb-1">📦 Wholesale</div>
                        <div className="text-2xl font-bold text-orange-700">₹{pricingData.platformPrices?.wholesale || 0}</div>
                      </div>
                    </div>
                  </Card>

                  {/* AI Recommendations */}
                  {pricingData.recommendations && (
                    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
                        <Sparkles className="w-5 h-5" />
                        AI Market Insights
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-indigo-700">Best Selling Price</div>
                            <div className="text-indigo-600">₹{pricingData.recommendations.bestSellingPrice}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-indigo-700">Market Analysis</div>
                            <div className="text-indigo-600">{pricingData.recommendations.competitorAnalysis}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-indigo-700">Seasonal Strategy</div>
                            <div className="text-indigo-600">{pricingData.recommendations.seasonalAdjustment}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="font-semibold text-indigo-700">Bulk Pricing</div>
                            <div className="text-indigo-600">{pricingData.recommendations.bulkDiscount}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                  </>
                ) : (
                  /* Ready State - Similar to AI Content Studio */
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Calculator className="w-12 h-12 text-green-500" />
                      <h2 className="text-3xl font-heading text-craft-primary">Ready for Smart Pricing</h2>
                      <Sparkles className="w-12 h-12 text-purple-500" />
                    </div>
                    <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
                      Enter your product details and watch AI calculate the optimal pricing strategy for your handcrafted products across different markets.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-4xl mb-3">🧮</div>
                        <h3 className="font-semibold text-green-700 mb-2">AI-Powered Calculation</h3>
                        <p className="text-sm text-green-600">Advanced algorithms consider market demand, competitor pricing, and seasonal factors</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="font-semibold text-blue-700 mb-2">Market Analysis</h3>
                        <p className="text-sm text-blue-600">Get insights on local, online, premium, and wholesale pricing strategies</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                        <div className="text-4xl mb-3">💰</div>
                        <h3 className="font-semibold text-purple-700 mb-2">Profit Optimization</h3>
                        <p className="text-sm text-purple-600">Maximize your earnings with intelligent pricing recommendations</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h3 className="font-semibold text-green-700 mb-3">How it works:</h3>
                      <div className="flex justify-center gap-8 text-sm text-green-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                          <span>Enter product details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                          <span>AI analyzes market</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                          <span>Get optimal pricing</span>
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