"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Target, Zap, Globe, BarChart3, Bot } from "lucide-react"
import ClubInfoForm from "@/components/club-info-form"
import LanguageSelector from "@/components/language-selector"
import { useTranslation, type Language } from "@/lib/i18n"
import Link from "next/link"

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en")
  const { t } = useTranslation(language)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">AI Sponsor Finder</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/tracking">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hover:bg-accent transition-colors bg-transparent"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Tracking
                </Button>
              </Link>
              <LanguageSelector value={language} onValueChange={setLanguage} />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Bot className="mr-2 h-4 w-4" />
            AI-Powered Sponsorship Matching
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">{t("heroTitle")}</h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => {
                const clubSection = document.querySelector('[data-section="club-form"]')
                clubSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {t("getStarted")} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent cursor-pointer hover:bg-accent transition-colors"
              onClick={() => {
                const featuresSection = document.querySelector('[data-section="features"]')
                featuresSection?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {t("seeHowItWorks")}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" data-section="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("whyChoose")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("featuresSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Target className="h-16 w-16 text-primary" />
                </div>
                <CardTitle>{t("smartMatching")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("smartMatchingDesc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Zap className="h-16 w-16 text-primary" />
                </div>
                <CardTitle>{t("instantPitch")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("instantPitchDesc")}</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Globe className="h-16 w-16 text-primary" />
                </div>
                <CardTitle>{t("multiLanguage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("multiLanguageDesc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Club Information Form Section */}
      <section className="py-16 px-4 bg-muted/30" data-section="club-form">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("tellUsAboutClub")}</h2>
            <p className="text-muted-foreground text-lg">{t("formSubtitle")}</p>
          </div>

          <ClubInfoForm language={language} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{t("footerText")}</p>
        </div>
      </footer>
    </div>
  )
}
