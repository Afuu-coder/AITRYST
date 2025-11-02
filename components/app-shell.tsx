"use client"

import type React from "react"
import { useState } from "react"
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
  Info,
} from "lucide-react"
import { ArtisanIcon } from "@/components/custom-icons"

interface AppShellProps {
  children: React.ReactNode
  currentPage?: string
  showSidebar?: boolean
}

export default function AppShell({ children, currentPage = "home", showSidebar = false }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Navigation items
  const navigationItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "about", label: "About", icon: Info, href: "/about" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "studio", label: "Studio", icon: Palette, href: "/studio" },
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "library", label: "Library", icon: BarChart3 },
    { id: "insights", label: "Insights", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
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
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar (if enabled) */}
      {showSidebar && (
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-heading text-lg">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={showSidebar ? "lg:ml-64" : ""}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
        <div className="container-craft py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ArtisanIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-lg text-foreground">AITRYST</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering Indian artisans with AI-powered tools to showcase and sell their handcrafted products.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-craft-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Image Enhancement</li>
                <li>Voice Recording</li>
                <li>AI Content Generation</li>
                <li>Smart Pricing</li>
                <li>QR Microsite</li>
                <li>Festival Campaigns</li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground border-b pb-2 border-primary/20">Company</h3>
              <div className="space-y-2">
                <a href="/about" className="block text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                  About AITRYST
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-craft-primary transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AITRYST. All rights reserved. Made with ❤️ for Indian Artisans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
