"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Sparkles } from "lucide-react"
import { UserStorage } from "@/lib/user-storage"

interface UserSetupProps {
  onUserCreated: () => void
}

export default function UserSetup({ onUserCreated }: UserSetupProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setIsCreating(true)
    try {
      UserStorage.createUser(name.trim(), email.trim())
      onUserCreated()
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to AI Sponsor Finder</CardTitle>
          <p className="text-muted-foreground">Let's set up your account to get personalized sponsor recommendations</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer hover:bg-primary/90 transition-colors"
              disabled={isCreating || !name.trim() || !email.trim()}
            >
              {isCreating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  Get Started
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
