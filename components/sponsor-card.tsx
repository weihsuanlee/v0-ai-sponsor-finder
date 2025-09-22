"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Copy, Globe, Mail, Lightbulb, Target, CheckCircle } from "lucide-react"
import type { Sponsor, ClubData, PitchContent, Language } from "@/lib/types"
import { generatePitch } from "@/lib/api"

interface SponsorCardProps {
  sponsor: Sponsor
  clubData: ClubData
}

export default function SponsorCard({ sponsor, clubData }: SponsorCardProps) {
  const [pitchContent, setPitchContent] = useState<PitchContent | null>(null)
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleGeneratePitch = async (language: Language = "en") => {
    setIsGeneratingPitch(true)
    try {
      const pitch = await generatePitch(clubData, sponsor, language)
      setPitchContent(pitch)
      setSelectedLanguage(language)
    } catch (error) {
      console.error("Error generating pitch:", error)
    } finally {
      setIsGeneratingPitch(false)
    }
  }

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const languageLabels = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{sponsor.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {sponsor.industry}
              </Badge>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {sponsor.sponsorshipBudget}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Description */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">{sponsor.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-3 w-3" />
            <span>Target: {sponsor.targetAudience}</span>
          </div>
        </div>

        {/* Match Reason */}
        <div className="bg-primary/5 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-primary mb-1">Why they'd sponsor you:</h4>
          <p className="text-sm text-muted-foreground">{sponsor.matchReason}</p>
        </div>

        {/* Contact Info */}
        {(sponsor.contactInfo.website || sponsor.contactInfo.email) && (
          <div className="flex gap-2 text-xs">
            {sponsor.contactInfo.website && (
              <Button variant="outline" size="sm" asChild>
                <a href={sponsor.contactInfo.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3 w-3 mr-1" />
                  Website
                </a>
              </Button>
            )}
            {sponsor.contactInfo.email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${sponsor.contactInfo.email}`}>
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Generate Pitch Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Pitch Materials
            </h4>
            <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!pitchContent && !isGeneratingPitch && (
            <Button
              onClick={() => handleGeneratePitch(selectedLanguage)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Generate Pitch Materials
            </Button>
          )}

          {isGeneratingPitch && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          {pitchContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Generated in {languageLabels[selectedLanguage]}</span>
                <Button onClick={() => handleGeneratePitch(selectedLanguage)} variant="ghost" size="sm">
                  Regenerate
                </Button>
              </div>

              {/* Email Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium">Email Subject</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.emailSubject, "subject")}
                    className="h-6 px-2"
                  >
                    {copiedField === "subject" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="bg-muted p-2 rounded text-sm">{pitchContent.emailSubject}</div>
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium">Email Body</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.emailBody, "email")}
                    className="h-6 px-2"
                  >
                    {copiedField === "email" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Textarea value={pitchContent.emailBody} readOnly rows={6} className="text-sm resize-none" />
              </div>

              {/* Slogan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs font-medium">Partnership Slogan</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.slogan, "slogan")}
                    className="h-6 px-2"
                  >
                    {copiedField === "slogan" ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="bg-primary/5 p-2 rounded text-sm font-medium text-primary">"{pitchContent.slogan}"</div>
              </div>

              {/* Key Benefits */}
              <div>
                <Label className="text-xs font-medium">Key Benefits for Sponsor</Label>
                <ul className="mt-1 space-y-1">
                  {pitchContent.keyBenefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collaboration Ideas */}
              <div>
                <Label className="text-xs font-medium">Collaboration Ideas</Label>
                <ul className="mt-1 space-y-1">
                  {pitchContent.collaborationIdeas.map((idea, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-secondary mt-1">•</span>
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <div className="bg-secondary/5 p-3 rounded-lg">
                <Label className="text-xs font-medium text-secondary">Call to Action</Label>
                <p className="text-sm mt-1">{pitchContent.callToAction}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-xs font-medium text-muted-foreground ${className}`}>{children}</div>
}
