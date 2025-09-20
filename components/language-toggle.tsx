"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  currentLanguage: 'en' | 'hi'
  onToggle: () => void
  className?: string
}

export function LanguageToggle({ currentLanguage, onToggle, className = "" }: LanguageToggleProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border hover:bg-accent hover:text-accent-foreground transition-colors ${className}`}
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {currentLanguage === 'en' ? 'हिं' : 'EN'}
      </span>
    </Button>
  )
}
