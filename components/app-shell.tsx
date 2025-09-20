"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Home,
  LayoutDashboard,
  Palette,
  BarChart3,
  Settings,
  Menu,
  X,
  MessageCircle,
  Camera,
  Mic,
  FileText,
  Calculator,
  QrCode,
  Calendar,
  PaletteIcon,
  Star,
  Info,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArtisanIcon } from "@/components/custom-icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AppShellProps {
  children: React.ReactNode
  currentPage?: string
  showSidebar?: boolean
}

export default function AppShell({ children, currentPage = "home", showSidebar = false }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Simplified navigation - removed About page
  const navigationItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "studio", label: "Studio", icon: Palette, href: "/studio" },
  ]

  const studioFeatures = [
    { id: "image-upload", label: "Image Enhancement", icon: Camera },
    { id: "voice-record", label: "Voice Recording", icon: Mic },
    { id: "content-gen", label: "Content Generation", icon: FileText },
    { id: "pricing-calc", label: "Smart Pricing", icon: Calculator },
    { id: "qr-microsite", label: "QR Microsite", icon: QrCode },
    { id: "festival-campaigns", label: "Festival Campaigns", icon: Calendar },
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "library", label: "Library", icon: BarChart3 },
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  // About page content moved to footer modal
  const aboutContent = {
    title: "About AITRYST",
    mission: "We're on a mission to transform the way Indian artisans showcase and sell their handcrafted products by providing cutting-edge AI tools that honor tradition while embracing innovation.",
    features: [
      {
        title: "Empowering Artisans",
        description: "We provide cutting-edge AI tools that help Indian artisans showcase their crafts to a global audience.",
      },
      {
        title: "Cultural Preservation",
        description: "Our platform helps preserve traditional Indian crafts by making them accessible to new generations.",
      },
      {
        title: "Global Reach",
        description: "Connect artisans with customers worldwide through multilingual content and international marketing.",
      },
      {
        title: "AI Innovation",
        description: "Leveraging artificial intelligence to transform how artisans create, market, and sell their products.",
      }
    ],
    values: [
      "Authenticity - We honor the authenticity of traditional Indian crafts",
      "Community - Building a supportive community for artisans",
      "Quality - Promoting excellence in craftsmanship",
      "Sustainability - Supporting sustainable livelihoods for artisans"
    ]
  }

  return (
    <div className="min-h-screen bg-background craft-texture">
      {loading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="craft-loader"></div>
        </div>
      )}

      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 ajrakh-pattern">
        <div className="container-craft">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Brand */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-xl flex items-center justify-center festival-glow">
                <ArtisanIcon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-heading text-craft-primary">AITRYST</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Artisan AI Assistant</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
              {navigationItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-craft-primary ${
                    currentPage === item.id ? "text-craft-primary warli-stroke" : "text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              {/* About moved to footer modal */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-foreground hover:text-craft-primary p-0 h-auto">
                    About
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-craft-primary">{aboutContent.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Empowering Indian artisans with AI-powered tools
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <p className="text-base">{aboutContent.mission}</p>
                    
                    <div>
                      <h3 className="text-lg font-heading mb-3">What We Offer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aboutContent.features.map((feature, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium mb-1">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-heading mb-3">Our Values</h3>
                      <ul className="space-y-2">
                        {aboutContent.values.map((value, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-craft-primary">•</span>
                            <span className="text-sm">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (showSidebar) {
                    setSidebarOpen(!sidebarOpen)
                  } else {
                    setMobileMenuOpen(!mobileMenuOpen)
                  }
                }}
                className="lg:hidden p-2"
              >
                {sidebarOpen || mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {!showSidebar && mobileMenuOpen && (
            <div className="lg:hidden border-t bg-card/95 backdrop-blur-md">
              <nav className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50 ${
                      currentPage === item.id ? "text-craft-primary bg-muted/30" : "text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </a>
                ))}
                {/* About moved to footer modal for mobile */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-foreground hover:bg-muted/50 text-sm font-medium px-4 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Info className="w-4 h-4 mr-3" />
                      About
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-heading text-craft-primary">{aboutContent.title}</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Empowering Indian artisans with AI-powered tools
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <p className="text-base">{aboutContent.mission}</p>
                      
                      <div>
                        <h3 className="text-lg font-heading mb-3">What We Offer</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {aboutContent.features.map((feature, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <h4 className="font-medium mb-1">{feature.title}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-heading mb-3">Our Values</h3>
                        <ul className="space-y-2">
                          {aboutContent.values.map((value, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-craft-primary">•</span>
                              <span className="text-sm">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </nav>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {showSidebar && (
          <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <aside
              className={`fixed lg:static inset-y-0 left-0 z-40 w-64 lg:w-72 bg-sidebar border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex flex-col h-full pt-4 lg:pt-6">
                <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                  <h2 className="text-lg font-heading text-sidebar-foreground">Dashboard</h2>
                  <p className="text-sm text-sidebar-foreground/70">Your workspace</p>
                </div>

                <nav className="flex-1 px-3 lg:px-4 space-y-1 lg:space-y-2">
                  {sidebarItems.map((item) => (
                    <div key={item.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm lg:text-base py-2 lg:py-3"
                      >
                        <item.icon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                        {item.label}
                      </Button>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showSidebar ? "lg:ml-0" : ""}`}>{children}</main>
      </div>

      <footer className="border-t bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm">
        <div className="container-craft section-spacing">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center festival-glow">
                  <ArtisanIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-heading text-2xl text-craft-primary">AITRYST</span>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed">
                Empowering Indian artisans with AI-powered tools to transform handicrafts into compelling stories and successful businesses.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Made with ❤️ for Indian craftspeople
              </p>
            </div>

            {/* AI Tools */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">AI Tools</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <Camera className="w-4 h-4 mr-2" />
                    Image Enhancement
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    Content Generation
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <Calculator className="w-4 h-4 mr-2" />
                    Smart Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Microsites
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Recording
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-muted-foreground hover:text-craft-primary transition-colors">
                    <Calendar className="w-4 h-4 mr-2" />
                    Festival Campaigns
                  </a>
                </li>
              </ul>
            </div>

            {/* Languages & Connect */}
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Languages</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <span className="text-sm text-muted-foreground">हिन्दी (Hindi)</span>
                  <span className="text-sm text-muted-foreground">বাংলা (Bengali)</span>
                  <span className="text-sm text-muted-foreground">తెలుగు (Telugu)</span>
                  <span className="text-sm text-muted-foreground">English</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Connect</h3>
                <div className="flex items-center mt-3">
                  <MessageCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">support@aitryst.com</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Supporting artisans across India
                </p>
              </div>
            </div>

            {/* About Modal Trigger */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Company</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="justify-start p-0 h-auto font-normal text-sm text-muted-foreground hover:text-craft-primary">
                    About AITRYST
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-heading text-craft-primary">{aboutContent.title}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Empowering Indian artisans with AI-powered tools
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <p className="text-base">{aboutContent.mission}</p>
                    
                    <div>
                      <h3 className="text-lg font-heading mb-3">What We Offer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aboutContent.features.map((feature, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <h4 className="font-medium mb-1">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-heading mb-3">Our Values</h3>
                      <ul className="space-y-2">
                        {aboutContent.values.map((value, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-craft-primary">•</span>
                            <span className="text-sm">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="pt-2">
                <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors block">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors block mt-1">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors block mt-1">
                  Cultural Guidelines
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground">
              <p>© 2025 AITRYST. Preserving culture, empowering craftspeople.</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                Cultural Guidelines
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trusted by 1,000+ artisans</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}