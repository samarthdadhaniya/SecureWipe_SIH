import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import "./globals.css"

export const metadata: Metadata = {
  title: "SecureWipe - Professional Data Wiping Tool",
  description: "Professional secure data wiping tool with compliance reporting and advanced sanitization methods",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex min-h-screen bg-background">
            <SidebarNavigation />
            <main className="flex-1 lg:pl-64">{children}</main>
          </div>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
