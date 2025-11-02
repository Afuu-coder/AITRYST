'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Sparkles,
  Camera,
  Mic,
  FileText,
  Calculator,
  QrCode,
  Calendar,
  TrendingUp,
  Users,
  Star,
  Heart,
  Globe,
  Zap,
  Shield,
  Target,
  Award,
  Palette,
  MessageSquare,
  BarChart3,
  Gift,
  Languages,
  Wand2,
  CheckCircle2
} from 'lucide-react'

export default function AboutPage() {
  const router = useRouter()
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const features = [
    {
      icon: Camera,
      title: 'Image Enhancement',
      description: 'AI-powered image enhancement for product photos with automatic background removal, lighting adjustment, and quality improvement.',
      color: 'bg-blue-500'
    },
    {
      icon: Mic,
      title: 'Voice Recording',
      description: 'Record product descriptions in your preferred language with speech-to-text conversion and multilingual support.',
      color: 'bg-green-500'
    },
    {
      icon: FileText,
      title: 'AI Content Generation',
      description: 'Generate compelling product descriptions, marketing content, and social media posts in multiple languages.',
      color: 'bg-purple-500'
    },
    {
      icon: Calculator,
      title: 'Smart Pricing',
      description: 'Calculate optimal pricing based on materials, labor, market trends, and competitor analysis.',
      color: 'bg-yellow-500'
    },
    {
      icon: QrCode,
      title: 'QR Microsite',
      description: 'Create instant product webpages with QR codes for easy sharing and direct customer engagement.',
      color: 'bg-pink-500'
    },
    {
      icon: Calendar,
      title: 'Festival Campaigns',
      description: 'Generate festival-specific marketing campaigns for Diwali, Holi, and other Indian festivals.',
      color: 'bg-red-500'
    },
    {
      icon: Sparkles,
      title: 'AI Assistance',
      description: '7 powerful AI features including personalized recommendations, market trends, price suggestions, and more.',
      color: 'bg-indigo-500'
    }
  ]

  const aiFeatures = [
    'Personalized Recommendations',
    'Market Trends Analysis',
    'Price Suggestions',
    'Design Improvement Tips',
    'Social Media Captions',
    'Ad Campaign Content',
    'Speech-to-Text Conversion'
  ]

  const stats = [
    { icon: Users, label: '1,000+ Artisans', value: '1000+', color: 'text-blue-600' },
    { icon: TrendingUp, label: 'Sales Boost', value: '300%', color: 'text-green-600' },
    { icon: Star, label: 'Rating', value: '4.9/5', color: 'text-yellow-600' },
    { icon: Globe, label: 'Languages', value: '10+', color: 'text-purple-600' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Authenticity',
      description: 'We honor the authenticity of traditional Indian crafts and preserve cultural heritage.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community for artisans to grow and succeed together.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Promoting excellence in craftsmanship and helping artisans showcase their best work.'
    },
    {
      icon: Shield,
      title: 'Sustainability',
      description: 'Supporting sustainable livelihoods and eco-friendly practices for artisans.'
    }
  ]

  const howItWorks = [
    {
      step: '1',
      title: 'Upload Your Product',
      description: 'Take a photo or upload an image of your handcrafted product.',
      icon: Camera
    },
    {
      step: '2',
      title: 'AI Enhancement',
      description: 'Our AI enhances your image, generates descriptions, and creates marketing content.',
      icon: Wand2
    },
    {
      step: '3',
      title: 'Generate QR & Share',
      description: 'Create a QR microsite and share your products with customers worldwide.',
      icon: QrCode
    },
    {
      step: '4',
      title: 'Track & Grow',
      description: 'Monitor your performance with analytics and grow your artisan business.',
      icon: BarChart3
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                About AITRYST
              </h1>
            </div>
            <Button onClick={() => router.push('/studio')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Try Studio
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center space-y-6 mb-16">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm">
            <Gift className="w-4 h-4 mr-2 inline" />
            Empowering Indian Artisans with AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Craft
            <br />
            with AI Technology
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AITRYST is an AI-powered platform designed to help Indian artisans showcase, market, and sell their handcrafted products to a global audience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-none">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're on a mission to transform the way Indian artisans showcase and sell their handcrafted products by providing cutting-edge AI tools that honor tradition while embracing innovation. Our platform bridges the gap between traditional craftsmanship and modern technology, helping artisans reach customers worldwide while preserving India's rich cultural heritage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Artisans
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to showcase and sell your handcrafted products
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-none">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">7 AI-Powered Features</h2>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Our AI Assistance includes 7 powerful features to help you grow your business:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-900 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in 4 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="relative hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <step.icon className="w-12 h-12 mx-auto mb-4 mt-4 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600">
              What drives us every day
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold">Powered by Advanced AI</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Built with cutting-edge technologies to provide the best experience for artisans:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-2">Google Gemini AI</h3>
                  <p className="text-gray-300 text-sm">Advanced AI for content generation and recommendations</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-2">Next.js 14</h3>
                  <p className="text-gray-300 text-sm">Modern web framework for fast, responsive experience</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="font-bold text-xl mb-2">Google Cloud</h3>
                  <p className="text-gray-300 text-sm">Reliable cloud infrastructure and AI services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-none">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Craft?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join 1,000+ artisans who are already using AITRYST to showcase their products and grow their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold text-lg px-8 py-6"
                  onClick={() => router.push('/studio')}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Try Studio Free
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
                  onClick={() => router.push('/dashboard')}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
