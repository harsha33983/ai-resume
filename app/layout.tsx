import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { StoreProvider } from "@/components/store-provider"
import { AuthProvider } from "@/components/auth-provider"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Resume Studio - Smart Job Application Portal",
  description:
    "AI-powered resume builder, analyzer, skill gap detector, and interview preparation platform.",
}

export const viewport: Viewport = {
  themeColor: "#2563eb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <StoreProvider>
            {children}
            <Toaster richColors position="top-right" />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
