"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Target, BarChart3, Building2, Handshake } from "lucide-react"
import Link from "next/link"
import type { ClubData, SponsorsResponse } from "@/lib/types"
import { generateSponsors } from "@/lib/api"
import SponsorCard from "@/components/sponsor-card"
import DemographicsChart from "@/components/demographics-chart"
import { UserStorage } from "@/lib/user-storage"

export default function ResultsPage() {
  const [clubData, setClubData] = useState<ClubData | null>(null)
  const [sponsorsData, setSponsorsData] = useState<SponsorsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedClubData = UserStorage.getClubData()
        if (!storedClubData) {
          setError("No club data found. Please fill out the form first.")
          return
        }

        setClubData(storedClubData)

        // Generate sponsors using AI
        const sponsors = await generateSponsors(storedClubData)
        setSponsorsData(sponsors)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to generate sponsor recommendations. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <CardContent>
            <div className="text-6xl mb-4">
              <Target className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <p className="text-destructive mb-4">{error}</p>
            <Link href="/">
              <Button className="cursor-pointer hover:bg-primary/90 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
                Back to Home
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-balance">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                {clubData ? `Sponsor Recommendations for ${clubData.clubName}` : "Sponsor Recommendations"}
              </h1>
            </div>
            <div className="flex-shrink-0">
              <Link href="/tracking">
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors bg-transparent w-full sm:w-auto"
                >
                  <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
                  Go to Tracking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-8">
            {/* Loading Demographics */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-gray-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full bg-gray-200" />
              </CardContent>
            </Card>

            {/* Loading Sponsors */}
            <div className="grid lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 bg-gray-200" />
                    <Skeleton className="h-4 w-24 bg-gray-200" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4 bg-gray-200" />
                    <Skeleton className="h-32 w-full bg-gray-200" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Demographics Analysis */}
            {clubData && sponsorsData && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DemographicsChart clubData={clubData} />
                </div>
                <div className="space-y-4">
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Demographics Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{sponsorsData.demographicsAnalysis}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Recommended Industries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {sponsorsData.recommendedIndustries.map((industry, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Sponsor Cards */}
            {sponsorsData && clubData && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Handshake className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">Potential Sponsors</h2>
                  <Badge variant="outline" className="bg-primary/10">
                    {sponsorsData.sponsors.length} matches found
                  </Badge>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {sponsorsData.sponsors.map((sponsor, index) => (
                    <SponsorCard key={index} sponsor={sponsor} clubData={clubData} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
