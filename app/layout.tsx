import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Poppins, Mukta, Noto_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { BackendProvider } from "@/components/BackendProvider"

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  /* Changed variable name to match globals.css usage */
  variable: "--font-poppins",
})

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
})

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "AITRYST - AI Assistant for Indian Artisans",
  description:
    "Transform your handcrafted products into compelling stories with AI-powered tools designed for Indian artisans",
  generator: "Next.js",
  authors: [{ name: "Aijaz Sultan" }],
  creator: "Aijaz Sultan",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/splash-screen.png",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${mukta.variable} ${notoSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFD700" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AITRYST" />
        <link rel="apple-touch-icon" href="/splash-screen.png" />
      </head>
      <body className="font-sans">
        <BackendProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            themes={["light", "dark"]}
            enableSystem={false}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </BackendProvider>
      </body>
    </html>
  )
}