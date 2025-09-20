"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Loader2, IndianRupee } from "lucide-react"
import toast from "react-hot-toast"
import { useBackendContext } from "@/components/BackendProvider"

interface PricingCalculatorProps {
  productData: any
  updateProductData: (data: any) => void
  onNext: () => void
}

const productTypes = [
  { value: "pottery", label: "Pottery & Ceramics", multiplier: 1.2 },
  { value: "textiles", label: "Textiles & Fabrics", multiplier: 1.5 },
  { value: "jewelry", label: "Jewelry & Accessories", multiplier: 2.0 },
  { value: "woodwork", label: "Woodwork & Furniture", multiplier: 1.3 },
  { value: "metalwork", label: "Metalwork & Brass", multiplier: 1.4 },
  { value: "paintings", label: "Paintings & Art", multiplier: 1.8 },
]

export function PricingCalculator({ productData, updateProductData, onNext }: PricingCalculatorProps) {
  const [materialCost, setMaterialCost] = useState("")
  const [hoursWorked, setHoursWorked] = useState("")
  const [productType, setProductType] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const { calculateProductPricing } = useBackendContext()

  const calculatePricing = async () => {
    if (!materialCost || !hoursWorked || !productType) {
      toast.error("Please fill all fields")
      return
    }

    setIsCalculating(true)

    try {
      // Calculate pricing using backend service
      const pricing = await calculateProductPricing(
        Number.parseFloat(materialCost),
        Number.parseFloat(hoursWorked),
        productType
      )

      if (!pricing) {
        throw new Error("Failed to calculate pricing")
      }

      updateProductData({ pricing })
      toast.success("Pricing calculated successfully!")
    } catch (error) {
      toast.error("Failed to calculate pricing")
      console.error("Pricing calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Smart Pricing</h2>
        <p className="text-muted-foreground">AI-powered pricing suggestions for your handcrafted products</p>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productType">Product Category</Label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger>
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="materialCost">Material Cost (₹)</Label>
            <Input
              id="materialCost"
              type="number"
              placeholder="200"
              value={materialCost}
              onChange={(e) => setMaterialCost(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoursWorked">Hours Worked</Label>
            <Input
              id="hoursWorked"
              type="number"
              placeholder="4"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculatePricing} disabled={isCalculating} className="w-full bg-accent hover:bg-accent/90">
          {isCalculating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 pottery-spinner" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate AI Pricing
            </>
          )}
        </Button>
      </Card>

      {productData.pricing && (
        <div className="space-y-4">
          {/* Cost Breakdown */}
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Cost Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Materials:</span>
                <span className="font-medium">₹{productData.pricing?.materialCost || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Labor ({hoursWorked}h × ₹150):</span>
                <span className="font-medium">₹{productData.pricing?.laborCost || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead (30%):</span>
                <span className="font-medium">₹{productData.pricing?.overhead || 0}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Base Cost:</span>
                <span>₹{productData.pricing?.materialCost + productData.pricing?.laborCost + productData.pricing?.overhead || 0}</span>
              </div>
              <div className="flex justify-between text-accent font-medium">
                <span>Profit Margin:</span>
                <span>₹{productData.pricing?.suggestedPrice - (productData.pricing?.materialCost + productData.pricing?.laborCost + productData.pricing?.overhead) || 0}</span>
              </div>
            </div>
          </Card>

          {/* Suggested Pricing */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-center">
              <h3 className="font-medium text-primary mb-2">AI Suggested Price</h3>
              <div className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <IndianRupee className="w-6 h-6" />
                {productData.pricing?.suggestedPrice || 0}
              </div>
            </div>
          </Card>

          {/* Platform Pricing */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Platform-Specific Pricing</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-medium">Local Market</div>
                <div className="text-lg font-bold text-primary">₹{productData.pricing?.platformPrices?.local || 0}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-medium">Online Store</div>
                <div className="text-lg font-bold text-primary">₹{productData.pricing?.platformPrices?.online || 0}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-medium">Premium Market</div>
                <div className="text-lg font-bold text-primary">₹{productData.pricing?.platformPrices?.premium || 0}</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-medium">Wholesale</div>
                <div className="text-lg font-bold text-primary">₹{productData.pricing?.platformPrices?.wholesale || 0}</div>
              </div>
            </div>
          </Card>

          <Button onClick={onNext} className="w-full bg-primary hover:bg-primary/90">
            Continue to QR Microsite
          </Button>
        </div>
      )}
    </div>
  )
}