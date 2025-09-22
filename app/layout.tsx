import type React from "react"
import { DM_Sans, Space_Mono } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

export const metadata = {
  title: "AI Sponsor Finder",
  description: "Find perfect sponsors for your sports club using AI",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
