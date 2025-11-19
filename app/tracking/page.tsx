"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "lucide-react";
import Link from "next/link";
import type { Sponsor, ClubData } from "@/lib/types";
import { generatePitchMaterials } from "@/lib/api";
import { UserStorage } from "@/lib/user-storage";
import LanguageSelector from "@/components/language-selector";
import { useStoredLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

type SponsorStatus = "Not Contacted" | "Contacted" | "In Discussion" | "Rejected" | "Approved";

interface TrackedSponsor extends Sponsor {
  id: string;
  status: SponsorStatus;
  dateAdded: string;
  clubData: ClubData;
}

export default function TrackingPage() {
  const [language, setLanguage] = useStoredLanguage("en");
  const { t } = useTranslation(language);
  const [trackedSponsors, setTrackedSponsors] = useState<TrackedSponsor[]>([]);
  const [draggedSponsor, setDraggedSponsor] = useState<TrackedSponsor | null>(null);
  const [pitchMaterials, setPitchMaterials] = useState<Record<string, any>>({});
  const [generatingPitch, setGeneratingPitch] = useState<Record<string, boolean>>({});
  const [mobileFilter, setMobileFilter] = useState<SponsorStatus | "All">("All");

  useEffect(() => {
    const sponsors = UserStorage.getTrackedSponsors();
    setTrackedSponsors(sponsors);
  }, []);

  const updateSponsorStatus = (sponsorId: string, newStatus: SponsorStatus) => {
    UserStorage.updateSponsorStatus(sponsorId, newStatus);
    const updated = UserStorage.getTrackedSponsors();
    setTrackedSponsors(updated);
  };

  const removeSponsor = (sponsorId: string) => {
    UserStorage.removeTrackedSponsor(sponsorId);
    const updated = UserStorage.getTrackedSponsors();
    setTrackedSponsors(updated);
  };

  const handleDragStart = (sponsor: TrackedSponsor) => {
    setDraggedSponsor(sponsor);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: SponsorStatus) => {
    e.preventDefault();
    if (draggedSponsor) {
      updateSponsorStatus(draggedSponsor.id, newStatus);
      setDraggedSponsor(null);
    }
  };

  const generatePitch = async (sponsor: TrackedSponsor) => {
    setGeneratingPitch((prev) => ({ ...prev, [sponsor.id]: true }));
    try {
      const materials = await generatePitchMaterials(sponsor, sponsor.clubData);
      setPitchMaterials((prev) => ({ ...prev, [sponsor.id]: materials }));
    } catch (error) {
      console.error("Error generating pitch materials:", error);
    } finally {
      setGeneratingPitch((prev) => ({ ...prev, [sponsor.id]: false }));
    }
  };

  const handleMobileFilterToggle = (status: SponsorStatus) => {
    setMobileFilter(mobileFilter === status ? "All" : status);
  };

  const filteredSponsors =
    mobileFilter === "All" ? trackedSponsors : trackedSponsors.filter((sponsor) => sponsor.status === mobileFilter);

  const getStatusIcon = (status: SponsorStatus) => {
    switch (status) {
      case "Not Contacted":
        return <Target className="h-4 w-4 flex-shrink-0" />;
      case "Contacted":
        return <Mail className="h-4 w-4 flex-shrink-0" />;
      case "In Discussion":
        return <Users className="h-4 w-4 flex-shrink-0" />;
      case "Rejected":
        return <ArrowLeft className="h-4 w-4 flex-shrink-0" />;
      case "Approved":
        return <BarChart3 className="h-4 w-4 flex-shrink-0" />;
      default:
        return <Target className="h-4 w-4 flex-shrink-0" />;
    }
  };

  const statusColorMap: Record<SponsorStatus, string> = {
    "Not Contacted": "bg-slate-50 border-slate-200 dark:bg-slate-950/40 dark:border-slate-800",
    Contacted: "bg-blue-50 border-blue-200 dark:bg-blue-500/20 dark:border-blue-500/40",
    "In Discussion": "bg-amber-50 border-amber-200 dark:bg-amber-400/20 dark:border-amber-400/40",
    Rejected: "bg-rose-50 border-rose-200 dark:bg-rose-500/20 dark:border-rose-500/40",
    Approved: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/20 dark:border-emerald-500/40",
  };

  const getStatusColor = (status: SponsorStatus) => statusColorMap[status] ?? statusColorMap["Not Contacted"];

  const statusLabels: Record<SponsorStatus, string> = {
    "Not Contacted": t("statusNotContacted"),
    Contacted: t("statusContacted"),
    "In Discussion": t("statusInDiscussion"),
    Rejected: t("statusRejected"),
    Approved: t("statusApproved"),
  };

  const statusColumns: { status: SponsorStatus; title: string; icon: React.ReactNode }[] = [
    {
      status: "Not Contacted",
      title: statusLabels["Not Contacted"],
      icon: <Target className="h-5 w-5 flex-shrink-0" />,
    },
    { status: "Contacted", title: statusLabels["Contacted"], icon: <Mail className="h-5 w-5 flex-shrink-0" /> },
    {
      status: "In Discussion",
      title: statusLabels["In Discussion"],
      icon: <Users className="h-5 w-5 flex-shrink-0" />,
    },
    { status: "Rejected", title: statusLabels["Rejected"], icon: <ArrowLeft className="h-5 w-5 flex-shrink-0" /> },
    { status: "Approved", title: statusLabels["Approved"], icon: <BarChart3 className="h-5 w-5 flex-shrink-0" /> },
  ];

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
                {t("backToResults")}
              </Link>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary flex-shrink-0" />
                {t("trackingTitle")}
              </h1>
              <p className="text-muted-foreground mt-1">
                <span className="hidden lg:inline">{t("trackingSubtitleDesktop")}</span>
                <span className="lg:hidden">{t("trackingSubtitleMobile")}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector value={language} onValueChange={setLanguage} className="w-36" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {trackedSponsors.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <div className="mb-4">
                <Target className="h-16 w-16 mx-auto text-muted-foreground flex-shrink-0" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("trackingEmptyTitle")}</h2>
              <p className="text-muted-foreground mb-6">{t("trackingEmptyDescription")}</p>
              <Link href="/results">
                <Button>
                  <Target className="mr-2 h-4 w-4" />
                  {t("viewSponsorRecommendations")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Pipeline Stats - Mobile/Tablet Tab Bar */}
            <div className="lg:hidden">
              <div className="flex overflow-x-auto gap-2 pb-2">
                <Button
                  variant={mobileFilter === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMobileFilter("All")}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {t("filterAll")} ({trackedSponsors.length})
                </Button>
                {statusColumns.map(({ status, title, icon }) => {
                  const count = trackedSponsors.filter((s) => s.status === status).length;
                  const isActive = mobileFilter === status;
                  return (
                    <Button
                      key={status}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMobileFilter(status)}
                      className="whitespace-nowrap flex-shrink-0"
                    >
                      <span className="mr-1">{icon}</span>
                      {title} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Stats - Desktop Cards */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-4">
              {statusColumns.map(({ status, title, icon }) => {
                const count = trackedSponsors.filter((s) => s.status === status).length;
                return (
                  <Card key={status} className="hover:shadow-md transition-all">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2 text-primary">{icon}</div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs text-muted-foreground">{title}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Kanban Board */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-4">
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
                          className="cursor-move hover:shadow-md transition-all duration-200 dark:border-slate-800"
                          draggable
                          onDragStart={() => handleDragStart(sponsor)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 line-clamp-1 min-w-0">
                                <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                                <h4 className="font-semibold text-sm truncate">{sponsor.name}</h4>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSponsor(sponsor.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors p-1 h-auto"
                              >
                                <Trash2 className="h-3 w-3 flex-shrink-0" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Badge
                                variant="outline"
                                className="text-xs dark:border-slate-700 dark:text-slate-100 max-w-full line-clamp-1 truncate"
                                title={sponsor.industry}
                              >
                                {sponsor.industry}
                              </Badge>
                              <p className="text-xs text-muted-foreground line-clamp-2">{sponsor.description}</p>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                {new Date(sponsor.dateAdded).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="w-full bg-transparent text-xs">
                                    <Eye className="h-3 w-3 mr-1 flex-shrink-0" />
                                    {t("viewDetails")}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <Building2 className="h-5 w-5 flex-shrink-0" />
                                      {sponsor.name}
                                    </DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="font-medium mb-3">{t("companyDetails")}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">{sponsor.description}</p>
                                        <div className="space-y-2 text-sm">
                                          <div>
                                            <strong>{t("industryLabel")}:</strong> {sponsor.industry}
                                          </div>
                                          <div>
                                            <strong>{t("targetAudienceLabel")}:</strong> {sponsor.targetAudience}
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="font-medium mb-3">{t("contactInformation")}</h4>
                                        <div className="space-y-2">
                                          {sponsor.contactInfo.website && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full bg-transparent"
                                            >
                                              <a
                                                href={sponsor.contactInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <Globe className="h-3 w-3 mr-2 flex-shrink-0" />
                                                {t("visitWebsite")}
                                              </a>
                                            </Button>
                                          )}
                                          {sponsor.contactInfo.email && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full bg-transparent"
                                            >
                                              <a href={`mailto:${sponsor.contactInfo.email}`}>
                                                <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                                                {t("sendEmail")}
                                              </a>
                                            </Button>
                                          )}
                                          {sponsor.contactInfo.phone && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              asChild
                                              className="w-full bg-transparent"
                                            >
                                              <a href={`tel:${sponsor.contactInfo.phone}`}>
                                                <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                                                {t("callNow")}
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-2">{t("whyTheyWouldSponsor")}</h4>
                                      <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                                        {sponsor.matchReason}
                                      </p>
                                    </div>

                                    {sponsor.campaignIdeas && (
                                      <div>
                                        <h4 className="font-medium mb-2">{t("campaignIdeas")}</h4>
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
                                          <Bot className="h-4 w-4 flex-shrink-0" />
                                          {t("aiPitchMaterials")}
                                        </h4>
                                        <Button
                                          onClick={() => generatePitch(sponsor)}
                                          disabled={generatingPitch[sponsor.id]}
                                          size="sm"
                                        >
                                          {generatingPitch[sponsor.id] ? (
                                            <>
                                              <Zap className="h-3 w-3 mr-2 animate-spin flex-shrink-0" />
                                              {t("generating")}
                                            </>
                                          ) : (
                                            <>
                                              <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                              {t("generatePitch")}
                                            </>
                                          )}
                                        </Button>
                                      </div>

                                      {pitchMaterials[sponsor.id] && (
                                        <div className="space-y-3">
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">{t("emailSubject")}</h5>
                                            <p className="text-sm">{pitchMaterials[sponsor.id].emailSubject}</p>
                                          </div>
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">{t("pitchEmail")}</h5>
                                            <div className="text-sm whitespace-pre-wrap">
                                              {pitchMaterials[sponsor.id].pitchEmail}
                                            </div>
                                          </div>
                                          <div className="bg-primary/5 p-3 rounded-lg">
                                            <h5 className="font-medium text-sm mb-2">{t("keyTalkingPoints")}</h5>
                                            <ul className="text-sm space-y-1">
                                              {pitchMaterials[sponsor.id].talkingPoints?.map(
                                                (point: string, index: number) => (
                                                  <li key={index} className="flex items-start gap-2">
                                                    <span className="text-primary">•</span>
                                                    {point}
                                                  </li>
                                                )
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

            {/* Mobile/Tablet List View */}
            <div className="lg:hidden space-y-4">
              {mobileFilter !== "All" && (
                <div className="text-sm text-muted-foreground text-center py-2">
                  {t("trackingFilterShowing")} {filteredSponsors.length} {t("trackingFilterSponsorsWithStatus")}{" "}
                  <strong>{statusLabels[mobileFilter as SponsorStatus]}</strong>
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
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors p-1 h-auto flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 flex-shrink-0" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs dark:border-slate-700 dark:text-slate-100 max-w-full truncate"
                          title={sponsor.industry}
                        >
                          {sponsor.industry}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          {new Date(sponsor.dateAdded).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{sponsor.description}</p>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t("statusLabel")}</span>
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
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
                              {t("viewDetailsAndGenerate")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 flex-shrink-0" />
                                {sponsor.name}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">{t("companyDetails")}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{sponsor.description}</p>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>{t("industryLabel")}:</strong> {sponsor.industry}
                                    </div>
                                    <div>
                                      <strong>{t("targetAudienceLabel")}:</strong> {sponsor.targetAudience}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-3">{t("contactInformation")}</h4>
                                  <div className="space-y-2">
                                    {sponsor.contactInfo.website && (
                                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                                        <a href={sponsor.contactInfo.website} target="_blank" rel="noopener noreferrer">
                                          <Globe className="h-3 w-3 mr-2 flex-shrink-0" />
                                          {t("visitWebsite")}
                                        </a>
                                      </Button>
                                    )}
                                    {sponsor.contactInfo.email && (
                                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                                        <a href={`mailto:${sponsor.contactInfo.email}`}>
                                          <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                                          {t("sendEmail")}
                                        </a>
                                      </Button>
                                    )}
                                    {sponsor.contactInfo.phone && (
                                      <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                                        <a href={`tel:${sponsor.contactInfo.phone}`}>
                                          <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                                          {t("callNow")}
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">{t("whyTheyWouldSponsor")}</h4>
                                <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
                                  {sponsor.matchReason}
                                </p>
                              </div>

                              {sponsor.campaignIdeas && (
                                <div>
                                  <h4 className="font-medium mb-2">{t("campaignIdeas")}</h4>
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
                                    <Bot className="h-4 w-4 flex-shrink-0" />
                                    {t("aiPitchMaterials")}
                                  </h4>
                                  <Button
                                    onClick={() => generatePitch(sponsor)}
                                    disabled={generatingPitch[sponsor.id]}
                                    size="sm"
                                  >
                                    {generatingPitch[sponsor.id] ? (
                                      <>
                                        <Zap className="h-3 w-3 mr-2 animate-spin flex-shrink-0" />
                                        {t("generating")}
                                      </>
                                    ) : (
                                      <>
                                        <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                                        {t("generatePitch")}
                                      </>
                                    )}
                                  </Button>
                                </div>

                                {pitchMaterials[sponsor.id] && (
                                  <div className="space-y-3">
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">{t("emailSubject")}</h5>
                                      <p className="text-sm">{pitchMaterials[sponsor.id].emailSubject}</p>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">{t("pitchEmail")}</h5>
                                      <div className="text-sm whitespace-pre-wrap">
                                        {pitchMaterials[sponsor.id].pitchEmail}
                                      </div>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-lg">
                                      <h5 className="font-medium text-sm mb-2">{t("keyTalkingPoints")}</h5>
                                      <ul className="text-sm space-y-1">
                                        {pitchMaterials[sponsor.id].talkingPoints?.map(
                                          (point: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-primary">•</span>
                                              {point}
                                            </li>
                                          )
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
  );
}
