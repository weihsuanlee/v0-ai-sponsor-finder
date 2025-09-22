"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Trash2,
  Globe,
  Mail,
  BarChart3,
  Eye,
  Building2,
  Users,
  Target,
  Calendar,
  Phone,
  Bot,
  Zap,
  FileText,
} from "lucide-react"
import Link from "next/link"
import type { Sponsor, ClubData } from "@/lib/types"
import { generatePitchMaterials } from "@/lib/api"

type SponsorStatus = "Not Contacted" | "Contacted" | "In Discussion" | "Rejected" | "Approved"

interface TrackedSponsor extends Sponsor {
  id: string
  status: SponsorStatus
  dateAdded: string
  clubData: ClubData
}

export default function TrackingPage() {
  const [trackedSponsors, setTrackedSponsors] = useState<TrackedSponsor[]>([])
  const [draggedSponsor, setDraggedSponsor] = useState<TrackedSponsor | null>(null)
  const [pitchMaterials, setPitchMaterials] = useState<Record<string, any>>({})
  const [generatingPitch, setGeneratingPitch] = useState<Record<string, boolean>>({})
  const [mobileFilter, setMobileFilter] = useState<SponsorStatus | "All">("All")

  useEffect(() => {
    const stored = localStorage.getItem("trackedSponsors")
    if (stored) {
      setTrackedSponsors(JSON.parse(stored))
    }
  }, [])

  const updateSponsorStatus = (sponsorId: string, newStatus: SponsorStatus) => {
    const updated = trackedSponsors.map((sponsor) =>
      sponsor.id === sponsorId ? { ...sponsor, status: newStatus } : sponsor,
    )
    setTrackedSponsors(updated)
    localStorage.setItem("trackedSponsors", JSON.stringify(updated))
  }

  const removeSponsor = (sponsorId: string) => {
    const updated = trackedSponsors.filter((sponsor) => sponsor.id !== sponsorId)
    setTrackedSponsors(updated)
    localStorage.setItem("trackedSponsors", JSON.stringify(updated))
  }

  const handleDragStart = (sponsor: TrackedSponsor) => {
    setDraggedSponsor(sponsor)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: SponsorStatus) => {
    e.preventDefault()
    if (draggedSponsor) {
      updateSponsorStatus(draggedSponsor.id, newStatus)
      setDraggedSponsor(null)
    }
  }

  const generatePitch = async (sponsor: TrackedSponsor) => {
    setGeneratingPitch((prev) => ({ ...prev, [sponsor.id]: true }))
    try {
      const materials = await generatePitchMaterials(sponsor, sponsor.clubData)
      setPitchMaterials((prev) => ({ ...prev, [sponsor.id]: materials }))
    } catch (error) {
      console.error("Error generating pitch materials:", error)
    } finally {
      setGeneratingPitch((prev) => ({ ...prev, [sponsor.id]: false }))
    }
  }

  const handleMobileFilterToggle = (status: SponsorStatus) => {
    setMobileFilter(mobileFilter === status ? "All" : status)
  }

  const filteredSponsors =
    mobileFilter === "All" ? trackedSponsors : trackedSponsors.filter((sponsor) => sponsor.status === mobileFilter)

  const getStatusIcon = (status: SponsorStatus) => {
    switch (status) {
      case "Not Contacted":
        return <Target className="h-4 w-4" />
      case "Contacted":
        return <Mail className="h-4 w-4" />
      case "In Discussion":
        return <Users className="h-4 w-4" />
      case "Rejected":
        return <ArrowLeft className="h-4 w-4" />
      case "Approved":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: SponsorStatus) => {
    switch (status) {
      case "Not Contacted":
        return "bg-gray-100 border-gray-300"
      case "Contacted":
        return "bg-blue-100 border-blue-300"
      case "In Discussion":
        return "bg-yellow-100 border-yellow-300"
      case "Rejected":
        return "bg-red-100 border-red-300"
      case "Approved":
        return "bg-green-100 border-green-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const statusColumns: { status: SponsorStatus; title: string; icon: React.ReactNode }[] = [
    { status: "Not Contacted", title: "Not Contacted", icon: <Target className="h-5 w-5" /> },
    { status: "Contacted", title: "Contacted", icon: <Mail className="h-5 w-5" /> },
    { status: "In Discussion", title: "In Discussion", icon: <Users className="h-5 w-5" /> },
    { status: "Rejected", title: "Rejected", icon: <ArrowLeft className="h-5 w-5" /> },
    { status: "Approved", title: "Approved", icon: <BarChart3 className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/results"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Sponsor Tracking Board
              </h1>
              <p className="text-muted-foreground mt-1">
                <span className="hidden md:inline">Drag and drop sponsors to update their status</span>
                <span className="md:hidden">Manage your sponsor outreach pipeline</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {trackedSponsors.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <div className="mb-4">
                <Target className="h-16 w-16 mx-auto text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No Sponsors Tracked Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start by adding sponsors from your results page to track your outreach progress.
              </p>
              <Link href="/results">
                <Button className="cursor-pointer hover:bg-primary/90 transition-colors">
                  <Target className="mr-2 h-4 w-4" />
                  View Sponsor Recommendations
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pipeline Stats - Mobile Tab Bar */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto gap-2 pb-2">
                <Button
                  variant={mobileFilter === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMobileFilter("All")}
                  className="cursor-pointer hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  All ({trackedSponsors.length})
                </Button>
                {statusColumns.map(({ status, title, icon }) => {
                  const count = trackedSponsors.filter((s) => s.status === status).length
                  const isActive = mobileFilter === status
                  return (
                    <Button
                      key={status}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMobileFilter(status)}
                      className="cursor-pointer hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <span className="mr-1">{icon}</span>
                      {title} ({count})
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Pipeline Stats - Desktop Cards */}
            <div className="hidden md:grid md:grid-cols-5 gap-4">
              {statusColumns.map(({ status, title, icon }) => {
                const count = trackedSponsors.filter((s) => s.status === status).length
                return (
                  <Card key={status} className="hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2 text-primary">{icon}</div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">{title}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Desktop Kanban Board */}
            <div className="hidden md:grid md:grid-cols-5 gap-4">
              {statusColumns.map(({ status, title, icon }) => (
                <div
                  key={status}
                  className={`min-h-[600px] rounded-lg border-2 border-dashed p-4 ${getStatusColor(status)}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <div className="flex items-center gap-2 mb-4 font-semibold text-sm">
                    {icon}
                    <span>{title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {trackedSponsors.filter((s) => s.status === status).length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {trackedSponsors
                      .filter((sponsor) => sponsor.status === status)
                      .map((sponsor) => (
                        <Card
                          key={sponsor.id}
                          className="cursor-move hover:shadow-md transition-all duration-200 bg-white"
                          draggable
                          onDragStart={() => handleDragStart(sponsor)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 line-clamp-1">
                                <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                                <h4 className="font-semibold text-sm truncate">{sponsor.name}</h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSponsor(sponsor.id)}
                                className="text-destructive hover:text-destructive cursor-pointer hover:bg-destructive/10 transition-colors p-1 h-auto"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Badge variant="outline" className="text-xs">
                                {sponsor.industry}
                              </Badge>
                              <p className="text-xs text-muted-foreground line-clamp-2">{sponsor.description}</p>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(sponsor.dateAdded).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent text-xs"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Building2 className="h-5 w-5" />
                                      {sponsor.name}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="font-medium mb-3">Company Details</h4>
                                        <p className="text-sm text-muted-foreground mb-3">{sponsor.description}</p>
                                        <div className="space-y-2 text-sm">
                                          <div>
                                            <strong>Industry:</strong> {sponsor.industry}
                                          </div>
                                          <div>
                                            <strong>Budget:</strong> {sponsor.sponsorshipBudget}
                                          </div>
                                          <div>
                                            <strong>Target Audience:</strong> {sponsor.targetAudience}
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="font-medium mb-3">Contact Information</h4>
                                        <div className="space-y-2">
                                          {sponsor.contactInfo.website && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                            >
                                              <a
                                                href={sponsor.contactInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Globe className="h-3 w-3 mr-2" />
                                                Visit Website
                                              </a>
                                            </Button>
                                          )}
                                          {sponsor.contactInfo.email && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                            >
                                              <a href={`mailto:${sponsor.contactInfo.email}`}>
                                                <Mail className="h-3 w-3 mr-2" />
                                                Send Email
                                              </a>
                                            </Button>
                                          )}
                                          {sponsor.contactInfo.phone && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                            >
                                              <a href={`tel:${sponsor.contactInfo.phone}`}>
                                                <Phone className="h-3 w-3 mr-2" />
                                                Call Now
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">Why They'd Sponsor</h4>
                                      <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                                        {sponsor.matchReason}
                                      </p>
                                    </div>

                                    {sponsor.campaignIdeas && (
                                      <div>
                                        <h4 className="font-medium mb-2">Campaign Ideas</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                          {sponsor.campaignIdeas.map((idea, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-primary">•</span>
                                              {idea}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    <div className="border-t pt-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium flex items-center gap-2">
                                          <Bot className="h-4 w-4" />
                                          AI Pitch Materials
                                        </h4>
                                        <Button
                                          onClick={() => generatePitch(sponsor)}
                                          disabled={generatingPitch[sponsor.id]}
                                          size="sm"
                                          className="cursor-pointer hover:bg-primary/90 transition-colors"
                                        >
                                          {generatingPitch[sponsor.id] ? (
                                            <>
                                              <Zap className="h-3 w-3 mr-2 animate-spin" />
                                              Generating...
                                            </>
                                          ) : (
                                            <>
                                              <FileText className="h-3 w-3 mr-2" />
                                              Generate Pitch
                                            </>
                                          )}
                                        </Button>
                                      </div>

                                      {pitchMaterials[sponsor.id] && (
                                        <div className="space-y-3">
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Email Subject</h5>
                                            <p className="text-sm">{pitchMaterials[sponsor.id].emailSubject}</p>
                                          </div>
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Pitch Email</h5>
                                            <div className="text-sm whitespace-pre-wrap">
                                              {pitchMaterials[sponsor.id].pitchEmail}
                                            </div>
                                          </div>
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">Key Talking Points</h5>
                                            <ul className="text-sm space-y-1">
                                              {pitchMaterials[sponsor.id].talkingPoints?.map(
                                                (point: string, index: number) => (
                                                  <li key={index} className="flex items-start gap-2">
                                                    <span className="text-primary">•</span>
                                                    {point}
                                                  </li>
                                                ),
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile List View */}
            <div className="md:hidden space-y-4">
              {mobileFilter !== "All" && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  Showing {filteredSponsors.length} sponsors with status: <strong>{mobileFilter}</strong>
                </div>
              )}
              {filteredSponsors.map((sponsor) => (
                <Card key={sponsor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <h4 className="font-semibold truncate">{sponsor.name}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSponsor(sponsor.id)}
                        className="text-destructive hover:text-destructive cursor-pointer hover:bg-destructive/10 transition-colors p-1 h-auto flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {sponsor.industry}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(sponsor.dateAdded).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{sponsor.description}</p>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Select
                          value={sponsor.status}
                          onValueChange={(newStatus: SponsorStatus) => updateSponsorStatus(sponsor.id, newStatus)}
                        >
                          <SelectTrigger className="w-auto cursor-pointer">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusColumns.map(({ status, title, icon }) => (
                              <SelectItem key={status} value={status} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  {icon}
                                  {title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-2 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details & Generate Pitch
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                {sponsor.name}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Company Details</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{sponsor.description}</p>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Industry:</strong> {sponsor.industry}
                                    </div>
                                    <div>
                                      <strong>Budget:</strong> {sponsor.sponsorshipBudget}
                                    </div>
                                    <div>
                                      <strong>Target Audience:</strong> {sponsor.targetAudience}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-3">Contact Information</h4>
                                  <div className="space-y-2">
                                    {sponsor.contactInfo.website && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                      >
                                        <a href={sponsor.contactInfo.website} target="_blank" rel="noopener noreferrer">
                                          <Globe className="h-3 w-3 mr-2" />
                                          Visit Website
                                        </a>
                                      </Button>
                                    )}
                                    {sponsor.contactInfo.email && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                      >
                                        <a href={`mailto:${sponsor.contactInfo.email}`}>
                                          <Mail className="h-3 w-3 mr-2" />
                                          Send Email
                                        </a>
                                      </Button>
                                    )}
                                    {sponsor.contactInfo.phone && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="w-full cursor-pointer hover:bg-accent transition-colors bg-transparent"
                                      >
                                        <a href={`tel:${sponsor.contactInfo.phone}`}>
                                          <Phone className="h-3 w-3 mr-2" />
                                          Call Now
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Why They'd Sponsor</h4>
                                <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                                  {sponsor.matchReason}
                                </p>
                              </div>

                              {sponsor.campaignIdeas && (
                                <div>
                                  <h4 className="font-medium mb-2">Campaign Ideas</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {sponsor.campaignIdeas.map((idea, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <span className="text-primary">•</span>
                                        {idea}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium flex items-center gap-2">
                                    <Bot className="h-4 w-4" />
                                    AI Pitch Materials
                                  </h4>
                                  <Button
                                    onClick={() => generatePitch(sponsor)}
                                    disabled={generatingPitch[sponsor.id]}
                                    size="sm"
                                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                                  >
                                    {generatingPitch[sponsor.id] ? (
                                      <>
                                        <Zap className="h-3 w-3 mr-2 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="h-3 w-3 mr-2" />
                                        Generate Pitch
                                      </>
                                    )}
                                  </Button>
                                </div>

                                {pitchMaterials[sponsor.id] && (
                                  <div className="space-y-3">
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">Email Subject</h5>
                                      <p className="text-sm">{pitchMaterials[sponsor.id].emailSubject}</p>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">Pitch Email</h5>
                                      <div className="text-sm whitespace-pre-wrap">
                                        {pitchMaterials[sponsor.id].pitchEmail}
                                      </div>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">Key Talking Points</h5>
                                      <ul className="text-sm space-y-1">
                                        {pitchMaterials[sponsor.id].talkingPoints?.map(
                                          (point: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-primary">•</span>
                                              {point}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
