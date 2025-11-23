"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Copy,
  Globe,
  Mail,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  Monitor,
  Coffee,
  Car,
  Heart,
  DollarSign,
  ShoppingBag,
  Dumbbell,
  GraduationCap,
  Building2,
  Target,
  Lightbulb,
  Palette,
  Users,
  CheckSquare,
  Rocket,
  Phone,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import type { Sponsor, ClubData, PitchContent, Language } from "@/lib/types";
import { generatePitch } from "@/lib/api";
import { UserStorage } from "@/lib/user-storage";
import { useTranslation, languages, type TranslationKey } from "@/lib/i18n";

interface SponsorCardProps {
  sponsor: Sponsor;
  clubData: ClubData;
  language: Language;
}

export default function SponsorCard({ sponsor, clubData, language }: SponsorCardProps) {
  const { t } = useTranslation(language);
  const [pitchContent, setPitchContent] = useState<PitchContent | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    const tracked = UserStorage.isSponsorTracked(sponsor.name);
    setIsTracked(tracked);
  }, [sponsor.name]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleGeneratePitch = async (language: Language = "en") => {
    setIsGeneratingPitch(true);
    try {
      const pitch = await generatePitch(clubData, sponsor, language);
      setPitchContent(pitch);
      setSelectedLanguage(language);
    } catch (error) {
      console.error("Error generating pitch:", error);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleTrackSponsor = () => {
    if (isTracked) return;

    const sponsorWithStatus = {
      ...sponsor,
      id: `${sponsor.name}-${Date.now()}`,
      status: "Not Contacted" as const,
      dateAdded: new Date().toISOString(),
      clubData: clubData,
    };

    const success = UserStorage.addTrackedSponsor(sponsorWithStatus);
    if (success) {
      setIsTracked(true);
    }
  };

  const languageLabels = languages;

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case "Technology":
        return <Monitor className="h-6 w-6 flex-shrink-0" />;
      case "Food & Beverage":
        return <Coffee className="h-6 w-6 flex-shrink-0" />;
      case "Automotive":
        return <Car className="h-6 w-6 flex-shrink-0" />;
      case "Healthcare":
        return <Heart className="h-6 w-6 flex-shrink-0" />;
      case "Finance":
        return <DollarSign className="h-6 w-6 flex-shrink-0" />;
      case "Retail":
        return <ShoppingBag className="h-6 w-6 flex-shrink-0" />;
      case "Sports Equipment":
        return <Dumbbell className="h-6 w-6 flex-shrink-0" />;
      case "Education":
        return <GraduationCap className="h-6 w-6 flex-shrink-0" />;
      default:
        return <Building2 className="h-6 w-6 flex-shrink-0" />;
    }
  };

  const campaignIdeaKeys: Record<string, TranslationKey> = {
    Technology: "campaignIdeaTechnology",
    "Food & Beverage": "campaignIdeaFood",
    Automotive: "campaignIdeaAutomotive",
    Healthcare: "campaignIdeaHealthcare",
    Finance: "campaignIdeaFinance",
    Retail: "campaignIdeaRetail",
    "Sports Equipment": "campaignIdeaSports",
    Education: "campaignIdeaEducation",
  };

  const generateCampaignIdea = (sponsor: Sponsor) => {
    const key = campaignIdeaKeys[sponsor.industry] ?? "campaignIdeaDefault";
    return t(key);
  };

  return (
    <Card className="h-fit hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              {getIndustryIcon(sponsor.industry)}
            </div>
            <div>
              <CardTitle className="text-lg">{sponsor.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {sponsor.industry}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTrackSponsor}
              className={`h-8 w-8 p-0 transition-colors ${
                isTracked ? "cursor-default text-primary" : "cursor-pointer hover:bg-accent"
              }`}
              disabled={isTracked}
              title={isTracked ? t("alreadyTracked") : t("addToTracking")}
            >
              {isTracked ? (
                <BookmarkCheck className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <Bookmark className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
            {isTracked && <span className="text-xs text-primary font-medium">{t("addedToTracking")}</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Description */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">{sponsor.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-4 w-4 flex-shrink-0" />
            <span>
              {t("targetAudienceLabel")}: {sponsor.targetAudience}
            </span>
          </div>
        </div>

        {/* Match Reason */}
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <h4 className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 flex-shrink-0" />
            {t("whyTheyWouldSponsor")}
          </h4>
          <p className="text-sm text-muted-foreground">{sponsor.matchReason}</p>
        </div>

        <div className="bg-secondary/5 p-3 rounded-lg border border-secondary/10">
          <h4 className="text-sm font-medium text-secondary mb-1 flex items-center gap-2">
            <Palette className="h-4 w-4 flex-shrink-0" />
            {t("exampleCampaignIdea")}
          </h4>
          <p className="text-sm text-muted-foreground">{generateCampaignIdea(sponsor)}</p>
        </div>

        {/* Contact Info */}
        {(sponsor.contactInfo.website || sponsor.contactInfo.email) && (
          <div className="flex gap-2 text-xs">
            {sponsor.contactInfo.website && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 bg-transparent cursor-pointer hover:bg-accent transition-colors"
              >
                <a href={sponsor.contactInfo.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                  {t("website")}
                </a>
              </Button>
            )}
            {sponsor.contactInfo.email && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 bg-transparent cursor-pointer hover:bg-accent transition-colors"
              >
                <a href={`mailto:${sponsor.contactInfo.email}`}>
                  <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                  {t("contact")}
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Generate Pitch Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              {t("aiPitchMaterials")}
            </h4>
            <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
              <SelectTrigger className="w-32 h-8 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageLabels).map(([code, label]) => (
                  <SelectItem key={code} value={code} className="cursor-pointer">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!pitchContent && !isGeneratingPitch && (
            <Button
              onClick={() => handleGeneratePitch(selectedLanguage)}
              variant="outline"
              size="sm"
              className="w-full cursor-pointer hover:bg-accent transition-colors"
            >
              <Sparkles className="h-4 w-4 mr-2 flex-shrink-0" />
              {t("generatePitchMaterials")}
            </Button>
          )}

          {isGeneratingPitch && (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-20 w-full bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-16 w-full bg-gray-200 dark:bg-gray-800" />
            </div>
          )}

          {pitchContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("generatedIn")} {languageLabels[selectedLanguage]}
                </span>
                <Button
                  onClick={() => handleGeneratePitch(selectedLanguage)}
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer hover:bg-accent transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-1 flex-shrink-0" />
                  {t("regenerate")}
                </Button>
              </div>

              {/* Email Subject */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  {/* Label component is used here */}
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    {t("emailSubject")}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.emailSubject, "subject")}
                    className="h-6 px-2 cursor-pointer hover:bg-accent transition-colors"
                  >
                    {copiedField === "subject" ? (
                      <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <Copy className="h-3 w-3 flex-shrink-0" />
                    )}
                  </Button>
                </div>
                <div className="bg-muted p-2 rounded text-sm">{pitchContent.emailSubject}</div>
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  {/* Label component is used here */}
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    {t("emailBody")}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.emailBody, "email")}
                    className="h-6 px-2 cursor-pointer hover:bg-accent transition-colors"
                  >
                    {copiedField === "email" ? (
                      <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <Copy className="h-3 w-3 flex-shrink-0" />
                    )}
                  </Button>
                </div>
                <Textarea value={pitchContent.emailBody} readOnly rows={6} className="text-sm resize-none" />
              </div>

              {/* Slogan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  {/* Label component is used here */}
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Target className="h-3 w-3 flex-shrink-0" />
                    {t("partnershipSlogan")}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(pitchContent.slogan, "slogan")}
                    className="h-6 px-2 cursor-pointer hover:bg-accent transition-colors"
                  >
                    {copiedField === "slogan" ? (
                      <CheckCircle className="h-3 w-3 flex-shrink-0" />
                    ) : (
                      <Copy className="h-3 w-3 flex-shrink-0" />
                    )}
                  </Button>
                </div>
                <div className="bg-primary/5 p-2 rounded text-sm font-medium text-primary border border-primary/20">
                  <Sparkles className="h-4 w-4 inline mr-1 flex-shrink-0" />"{pitchContent.slogan}"
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                {/* Label component is used here */}
                <Label className="text-xs font-medium flex items-center gap-1">
                  <CheckSquare className="h-3 w-3 flex-shrink-0" />
                  {t("keyBenefits")}
                </Label>
                <ul className="mt-1 space-y-1">
                  {pitchContent.keyBenefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckSquare className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Collaboration Ideas */}
              <div>
                {/* Label component is used here */}
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Rocket className="h-3 w-3 flex-shrink-0" />
                  {t("collaborationIdeas")}
                </Label>
                <ul className="mt-1 space-y-1">
                  {pitchContent.collaborationIdeas.map((idea, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Rocket className="h-3 w-3 text-secondary mt-1 flex-shrink-0" />
                      {idea}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <div className="bg-secondary/5 p-3 rounded-lg border border-secondary/20">
                {/* Label component is used here */}
                <Label className="text-xs font-medium text-secondary flex items-center gap-1">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  {t("callToAction")}
                </Label>
                <p className="text-sm mt-1">{pitchContent.callToAction}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-xs font-medium text-muted-foreground ${className}`}>{children}</div>;
}
