'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  QrCode, 
  Sparkles,
  MessageSquare,
  Image,
  DollarSign,
  Calendar,
  Eye,
  Heart,
  Share2,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'

interface DashboardStats {
  qrCodes: {
    total: number
    thisMonth: number
    scans: number
    growth: number
  }
  aiAssistance: {
    totalRequests: number
    thisMonth: number
    mostUsed: string
    growth: number
  }
  products: {
    total: number
    active: number
    views: number
    growth: number
  }
  engagement: {
    likes: number
    shares: number
    orders: number
    growth: number
  }
}

export default function ArtisanDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    qrCodes: { total: 0, thisMonth: 0, scans: 0, growth: 0 },
    aiAssistance: { totalRequests: 0, thisMonth: 0, mostUsed: '', growth: 0 },
    products: { total: 0, active: 0, views: 0, growth: 0 },
    engagement: { likes: 0, shares: 0, orders: 0, growth: 0 }
  })

  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [aiUsage, setAiUsage] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // Load QR Codes data
    const qrCodesData = JSON.parse(localStorage.getItem('qr_codes_history') || '[]')
    const qrCodesThisMonth = qrCodesData.filter((item: any) => {
      const date = new Date(item.createdAt)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    // Load AI Assistance data
    const aiHistoryData = JSON.parse(localStorage.getItem('ai_assistance_history') || '[]')
    const aiThisMonth = aiHistoryData.filter((item: any) => {
      const date = new Date(item.timestamp)
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    // Calculate AI feature usage
    const featureUsage: { [key: string]: number } = {}
    aiHistoryData.forEach((item: any) => {
      featureUsage[item.feature] = (featureUsage[item.feature] || 0) + 1
    })
    const mostUsedFeature = Object.keys(featureUsage).reduce((a, b) => 
      featureUsage[a] > featureUsage[b] ? a : b, 'None'
    )

    // Load products data
    const productsData = qrCodesData.map((item: any) => item.productData).filter(Boolean)

    // Calculate total scans (simulated)
    const totalScans = qrCodesData.reduce((sum: number, item: any) => 
      sum + (item.scans || Math.floor(Math.random() * 50)), 0
    )

    // Set stats
    setStats({
      qrCodes: {
        total: qrCodesData.length,
        thisMonth: qrCodesThisMonth.length,
        scans: totalScans,
        growth: qrCodesThisMonth.length > 0 ? 15 : 0
      },
      aiAssistance: {
        totalRequests: aiHistoryData.length,
        thisMonth: aiThisMonth.length,
        mostUsed: mostUsedFeature,
        growth: aiThisMonth.length > 0 ? 22 : 0
      },
      products: {
        total: productsData.length,
        active: productsData.length,
        views: totalScans,
        growth: productsData.length > 0 ? 18 : 0
      },
      engagement: {
        likes: Math.floor(totalScans * 0.3),
        shares: Math.floor(totalScans * 0.15),
        orders: Math.floor(totalScans * 0.08),
        growth: totalScans > 0 ? 12 : 0
      }
    })

    // Set recent activity
    const allActivity = [
      ...qrCodesData.map((item: any) => ({
        type: 'qr_code',
        title: `QR Code created for ${item.productData?.name || 'Product'}`,
        time: item.createdAt,
        icon: 'qr'
      })),
      ...aiHistoryData.map((item: any) => ({
        type: 'ai_assistance',
        title: `Used ${item.feature}`,
        time: item.timestamp,
        icon: 'ai'
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)

    setRecentActivity(allActivity)

    // Set AI usage breakdown
    const aiUsageArray = Object.entries(featureUsage).map(([feature, count]) => ({
      feature,
      count,
      percentage: (count / aiHistoryData.length * 100) || 0
    })).sort((a, b) => b.count - a.count)

    setAiUsage(aiUsageArray)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Artisan Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track your studio tools and performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadDashboardData}>
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* QR Codes Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                QR Codes
              </CardTitle>
              <QrCode className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.qrCodes.total}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.qrCodes.thisMonth} created this month
              </p>
              <div className="flex items-center mt-2">
                {stats.qrCodes.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${stats.qrCodes.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.qrCodes.growth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistance Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                AI Assistance
              </CardTitle>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiAssistance.totalRequests}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.aiAssistance.thisMonth} requests this month
              </p>
              <div className="flex items-center mt-2">
                {stats.aiAssistance.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${stats.aiAssistance.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.aiAssistance.growth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Products
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products.total}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.products.active} active products
              </p>
              <div className="flex items-center mt-2">
                {stats.products.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${stats.products.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.products.growth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Scans
              </CardTitle>
              <Eye className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.qrCodes.scans}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.engagement.orders} orders received
              </p>
              <div className="flex items-center mt-2">
                {stats.engagement.growth > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${stats.engagement.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.engagement.growth}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest studio actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'qr_code' ? 'bg-purple-100' : 'bg-blue-100'
                          }`}>
                            {activity.type === 'qr_code' ? (
                              <QrCode className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(activity.time)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No activity yet</p>
                        <p className="text-xs mt-1">Start using studio tools to see activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Tools Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Tools Usage</CardTitle>
                  <CardDescription>Most used AI features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiUsage.length > 0 ? (
                      aiUsage.slice(0, 7).map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700 truncate">
                              {item.feature}
                            </span>
                            <span className="text-gray-500">{item.count} uses</span>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No AI usage yet</p>
                        <p className="text-xs mt-1">Try AI Assistance features</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>How customers interact with your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                    <div className="text-2xl font-bold text-pink-600">{stats.engagement.likes}</div>
                    <div className="text-xs text-gray-600 mt-1">Likes</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <Share2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">{stats.engagement.shares}</div>
                    <div className="text-xs text-gray-600 mt-1">Shares</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">{stats.engagement.orders}</div>
                    <div className="text-xs text-gray-600 mt-1">Orders</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Eye className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold text-purple-600">{stats.products.views}</div>
                    <div className="text-xs text-gray-600 mt-1">Views</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qr-codes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Performance</CardTitle>
                <CardDescription>Track your QR code microsites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total QR Codes</div>
                      <div className="text-3xl font-bold text-purple-600">{stats.qrCodes.total}</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Scans</div>
                      <div className="text-3xl font-bold text-blue-600">{stats.qrCodes.scans}</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Avg. Scans/QR</div>
                      <div className="text-3xl font-bold text-green-600">
                        {stats.qrCodes.total > 0 ? Math.round(stats.qrCodes.scans / stats.qrCodes.total) : 0}
                      </div>
                    </div>
                  </div>

                  {stats.qrCodes.total === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No QR codes created yet</p>
                      <p className="text-sm mt-2">Create your first QR microsite to see analytics</p>
                      <Button className="mt-4" onClick={() => window.location.href = '/studio/qr-microsite'}>
                        Create QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tools Tab */}
          <TabsContent value="ai-tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Tools Analytics</CardTitle>
                <CardDescription>Your AI assistance usage breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total Requests</div>
                      <div className="text-3xl font-bold text-blue-600">{stats.aiAssistance.totalRequests}</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Most Used Feature</div>
                      <div className="text-xl font-bold text-purple-600 truncate">
                        {stats.aiAssistance.mostUsed || 'None'}
                      </div>
                    </div>
                  </div>

                  {stats.aiAssistance.totalRequests === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No AI tools used yet</p>
                      <p className="text-sm mt-2">Try AI Assistance features to see analytics</p>
                      <Button className="mt-4" onClick={() => window.location.href = '/studio/ai-assistance'}>
                        Try AI Assistance
                      </Button>
                    </div>
                  )}

                  {aiUsage.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Feature Usage Breakdown</h3>
                      {aiUsage.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{item.feature}</span>
                            <Badge variant="secondary">{item.count} uses</Badge>
                          </div>
                          <Progress value={item.percentage} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {item.percentage.toFixed(1)}% of total usage
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Overall studio performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">QR Code Success Rate</div>
                        <div className="text-2xl font-bold text-purple-600">100%</div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">AI Response Time</div>
                        <div className="text-2xl font-bold text-blue-600">&lt;2s</div>
                      </div>
                      <Activity className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">Customer Satisfaction</div>
                        <div className="text-2xl font-bold text-green-600">4.8/5</div>
                      </div>
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Access your studio tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/studio/qr-microsite'}
                    >
                      <QrCode className="w-6 h-6" />
                      <span className="text-xs">QR Microsite</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/studio/ai-assistance'}
                    >
                      <Sparkles className="w-6 h-6" />
                      <span className="text-xs">AI Assistance</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={loadDashboardData}
                    >
                      <Activity className="w-6 h-6" />
                      <span className="text-xs">Refresh Data</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => window.location.href = '/'}
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span className="text-xs">View Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
