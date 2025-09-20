"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import AppShell from "@/components/app-shell"
import {
  Camera,
  Mic,
  FileText,
  Calculator,
  QrCode,
  Calendar,
  ArrowRight,
  Play,
  Zap,
  TrendingUp,
  Eye,
  BookOpen,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  Share2,
  Edit,
  Trash2,
  Star,
  Heart,
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  ShoppingBag,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Globe,
  Bell,
  User,
  Palette,
  Shield,
  HelpCircle,
  LogOut,
  Grid3X3,
  List,
  PieChart,
  UserCircle,
  ShoppingCart,
  Package,
  Store,
  Award,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"

// Marketplace-specific KPI data
const kpiData = [
  { label: "Products", value: "12", icon: Package, change: "+12%", color: "bg-blue-100 text-blue-600" },
  { label: "Orders", value: "8", icon: ShoppingCart, change: "+5%", color: "bg-green-100 text-green-600" },
  { label: "Revenue", value: "₹24,700", icon: DollarSign, change: "+22%", color: "bg-purple-100 text-purple-600" },
  { label: "Reviews", value: "4.9", icon: Star, change: "+0.2", color: "bg-yellow-100 text-yellow-600" },
]

// Marketplace-specific library data
const libraryItems = [
  {
    id: 1,
    title: "Handwoven Silk Saree",
    type: "Product",
    platform: "Marketplace",
    status: "Published",
    date: "2024-01-15",
    image: "/enhanced-pottery-vase-with-better-lighting-and-bac.jpg",
    likes: 24,
    shares: 8,
    views: 156,
  },
  {
    id: 2,
    title: "Ceramic Tea Set Collection",
    type: "Product",
    platform: "Marketplace",
    status: "Draft",
    date: "2024-01-14",
    image: "/artisan-uploading-product-photos.jpg",
    likes: 12,
    shares: 3,
    views: 89,
  },
  {
    id: 3,
    title: "Brass Diya Festival Campaign",
    type: "Campaign",
    platform: "Marketplace",
    status: "Scheduled",
    date: "2024-01-13",
    image: "/social-media-sharing-handcrafted-products.jpg",
    likes: 45,
    shares: 15,
    views: 234,
  },
  {
    id: 4,
    title: "Wooden Handicraft Showcase",
    type: "Product",
    platform: "Marketplace",
    status: "Published",
    date: "2024-01-12",
    image: "/ai-processing-artisan-products-with-magical-effect.jpg",
    likes: 67,
    shares: 22,
    views: 445,
  },
]

// Marketplace-specific insights data
const insightsData = {
  totalReach: 1247,
  totalEngagement: 89,
  totalSales: 12,
  conversionRate: 3.2,
  topPlatform: "Marketplace",
  weeklyGrowth: 15.3,
}

const platformStats = [
  { platform: "Marketplace", posts: 12, reach: 845, engagement: 68, color: "bg-blue-500" },
  { platform: "Instagram", posts: 8, reach: 456, engagement: 34, color: "bg-pink-500" },
  { platform: "Facebook", posts: 5, reach: 234, engagement: 23, color: "bg-blue-500" },
  { platform: "WhatsApp", posts: 12, reach: 345, engagement: 18, color: "bg-green-500" },
]

// Marketplace-specific settings data
const userSettings = {
  name: "Suman ji",
  email: "suman@potterystudio.com",
  phone: "+91 98765 43210",
  businessName: "Suman's Handicrafts",
  location: "Jaipur, Rajasthan",
  languages: ["Hindi", "English"],
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  privacy: {
    profilePublic: true,
    showStats: true,
    allowMessages: true,
  },
  storeInfo: {
    description: "Third-generation pottery artisans specializing in traditional Rajasthani ceramics.",
    specialties: ["Pottery", "Ceramics", "Traditional Designs"],
    badges: ["Verified Artisan", "Top Seller", "Heritage Craft"],
  }
}

// Recent orders data
const recentOrders = [
  {
    id: 1,
    customer: "Priya Sharma",
    product: "Handcrafted Ceramic Vase",
    amount: 899,
    status: "Delivered",
    date: "2024-01-15",
  },
  {
    id: 2,
    customer: "Rajesh Kumar",
    product: "Block Printed Cotton Saree",
    amount: 2499,
    status: "Shipped",
    date: "2024-01-14",
  },
  {
    id: 3,
    customer: "Anjali Patel",
    product: "Silver Kundan Necklace",
    amount: 3499,
    status: "Processing",
    date: "2024-01-13",
  },
]

// Recent reviews data
const recentReviews = [
  {
    id: 1,
    customer: "Priya Sharma",
    product: "Handcrafted Ceramic Vase",
    rating: 5,
    comment: "Absolutely beautiful craftsmanship! The attention to detail is remarkable.",
    date: "2024-01-15",
  },
  {
    id: 2,
    customer: "Rajesh Kumar",
    product: "Block Printed Cotton Saree",
    rating: 4,
    comment: "Great quality and fast delivery. The packaging was excellent.",
    date: "2024-01-10",
  },
  {
    id: 3,
    customer: "Anjali Patel",
    product: "Silver Kundan Necklace",
    rating: 5,
    comment: "The story behind these pieces makes them even more special.",
    date: "2024-01-05",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render the component on the client side to avoid hydration issues
  if (!isClient) {
    return null
  }

  return (
    <AppShell currentPage="dashboard" showSidebar={false}>
      <div className="container-craft section-spacing">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading text-craft-primary">Artisan Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Suman ji. Here's what's happening with your crafts today.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-marigold rounded-full flex items-center justify-center">
                <span className="text-lg">👋</span>
              </div>
              <div>
                <p className="text-sm font-medium">Suman ji</p>
                <p className="text-xs text-muted-foreground">Artisan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* KPI Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-2xl font-bold text-craft-primary mt-1">{kpi.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                      <kpi.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-3 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {kpi.change} from last week
                  </p>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-heading text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/studio">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Product
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/studio">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Messages (3)
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/studio">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View Orders
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg">Recent Orders</h3>
                  <Button variant="link" className="text-sm p-0 h-auto" asChild>
                    <Link href="/marketplace/orders">View All</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">₹{order.amount}</p>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Reviews */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg">Recent Reviews</h3>
                  <Button variant="link" className="text-sm p-0 h-auto" asChild>
                    <Link href="/studio">View All</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {review.customer.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{review.customer}</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-marigold fill-marigold' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Store Performance */}
            <Card className="p-6">
              <h3 className="font-heading text-xl mb-6">Store Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Platform Performance */}
                <div>
                  <h4 className="font-medium mb-4">Platform Performance</h4>
                  <div className="space-y-5">
                    {platformStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                            <span className="font-medium">{stat.platform}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{stat.reach} reach</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${stat.color}`}
                            style={{ width: `${(stat.reach / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{stat.posts} posts</span>
                          <span>{stat.engagement} engagement</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Growth */}
                <div>
                  <h4 className="font-medium mb-4">Weekly Growth</h4>
                  <div className="h-48 flex items-end gap-2 justify-center">
                    {[65, 80, 45, 90, 75, 85, 95].map((height, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-6 bg-primary rounded-t transition-all hover:bg-primary/80"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground mt-2">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button asChild>
                    <Link href="/studio">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Link>
                  </Button>
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {libraryItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-3 right-3" variant="secondary">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">{item.title}</h3>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>{item.platform}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{item.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              <span>{item.shares}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{item.views}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <div className="divide-y">
                    {libraryItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{item.type}</span>
                              <span>•</span>
                              <span>{item.platform}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{item.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              <span>{item.shares}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{item.views}</span>
                            </div>
                          </div>
                          <Badge variant="secondary">{item.status}</Badge>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="space-y-8">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Reach</p>
                      <p className="text-2xl font-bold">{insightsData.totalReach.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">{insightsData.totalEngagement}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sales</p>
                      <p className="text-2xl font-bold">{insightsData.totalSales}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion</p>
                      <p className="text-2xl font-bold">{insightsData.conversionRate}%</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Platform Performance */}
                <Card className="p-6">
                  <h3 className="font-heading text-xl mb-6">Platform Performance</h3>
                  <div className="space-y-5">
                    {platformStats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${stat.color} rounded-full`}></div>
                            <span className="font-medium">{stat.platform}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{stat.reach} reach</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${stat.color}`}
                            style={{ width: `${(stat.reach / 1000) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{stat.posts} posts</span>
                          <span>{stat.engagement} engagement</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Products */}
                <Card className="p-6">
                  <h3 className="font-heading text-xl mb-6">Top Performing Products</h3>
                  <div className="space-y-4">
                    {libraryItems.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.views} views</span>
                            <span>•</span>
                            <span>{item.likes} likes</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-marigold fill-marigold" />
                            <span className="text-sm font-medium">4.9</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Growth Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl">Weekly Growth</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Reach</span>
                  </div>
                </div>
                <div className="h-64 flex items-end gap-2 justify-center">
                  {[65, 80, 45, 90, 75, 85, 95].map((height, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-primary rounded-t transition-all hover:bg-primary/80"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-muted-foreground mt-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Card className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-terracotta to-marigold rounded-full flex items-center justify-center mb-4">
                        <User className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-heading">Suman ji</h3>
                      <p className="text-muted-foreground text-sm">Artisan</p>
                      <Button size="sm" variant="outline" className="mt-4" asChild>
                        <Link href="/studio">
                          View Public Profile
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-heading text-sm mb-3">Store Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {userSettings.storeInfo.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6">
                    <h3 className="font-heading text-xl mb-6">Store Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Business Name</label>
                        <Input defaultValue={userSettings.businessName} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Location</label>
                        <Input defaultValue={userSettings.location} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Store Description</label>
                        <textarea 
                          className="w-full min-h-[100px] p-3 border rounded-md bg-background text-foreground"
                          defaultValue={userSettings.storeInfo.description}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">Specialties</label>
                        <div className="flex flex-wrap gap-2">
                          {userSettings.storeInfo.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" className="h-6 text-xs">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-heading text-xl mb-6">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input type="email" defaultValue={userSettings.email} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone Number</label>
                        <Input defaultValue={userSettings.phone} />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-heading text-xl mb-6">Notifications</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Button
                          variant={userSettings.notifications.email ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.notifications.email ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive push notifications</p>
                        </div>
                        <Button
                          variant={userSettings.notifications.push ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.notifications.push ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                        </div>
                        <Button
                          variant={userSettings.notifications.sms ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.notifications.sms ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-heading text-xl mb-6">Privacy</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Public Profile</p>
                          <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                        </div>
                        <Button
                          variant={userSettings.privacy.profilePublic ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.privacy.profilePublic ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Statistics</p>
                          <p className="text-sm text-muted-foreground">Display your stats publicly</p>
                        </div>
                        <Button
                          variant={userSettings.privacy.showStats ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.privacy.showStats ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow Messages</p>
                          <p className="text-sm text-muted-foreground">Allow other users to message you</p>
                        </div>
                        <Button
                          variant={userSettings.privacy.allowMessages ? "default" : "outline"}
                          size="sm"
                        >
                          {userSettings.privacy.allowMessages ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <div className="flex gap-3">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}