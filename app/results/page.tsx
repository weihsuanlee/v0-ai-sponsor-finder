"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Target, BarChart3, Building2, Handshake, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ClubData, SponsorsResponse } from "@/lib/types";
import { generateSponsors } from "@/lib/api";
import SponsorCard from "@/components/sponsor-card";
import DemographicsChart from "@/components/demographics-chart";
import { UserStorage } from "@/lib/user-storage";
import LanguageSelector from "@/components/language-selector";
import { useTranslation, type TranslationKey } from "@/lib/i18n";
import { useStoredLanguage } from "@/lib/language";
import { ThemeToggle } from "@/components/theme-toggle";
import AgentAnalyzer from "@/components/agent-analyzer";

export default function ResultsPage() {
  const [language, setLanguage] = useStoredLanguage("en");
  const { t } = useTranslation(language);
  const [clubData, setClubData] = useState<ClubData | null>(null);
  const [sponsorsData, setSponsorsData] = useState<SponsorsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedClubData = UserStorage.getClubData();
        if (!storedClubData) {
          setErrorKey("noClubDataError");
          return;
        }

        setClubData(storedClubData);

        let sponsors = UserStorage.getCachedSponsors(storedClubData);
        if (!sponsors) {
          sponsors = await generateSponsors(storedClubData);
          UserStorage.saveSponsorResults(storedClubData, sponsors);
        }

        setSponsorsData(sponsors);
      } catch (err) {
        console.error("Error loading data:", err);
        setErrorKey("sponsorGenerationError");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (errorKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <CardContent>
            <div className="text-6xl mb-4">
              <Target className="h-16 w-16 mx-auto text-muted-foreground flex-shrink-0" />
            </div>
            <p className="text-destructive mb-4">{t(errorKey)}</p>
            <Link href="/">
              <Button className="cursor-pointer hover:bg-primary/90 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
                {t("backToHome")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">{t("resultsLoadingHeadline")}</p>
            <p className="text-xs text-muted-foreground">{t("resultsLoadingSubhead")}</p>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <Link
                  href="/"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
                  {t("backToHome")}
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Target className="h-8 w-8 text-primary flex-shrink-0" />
                  {clubData ? `${t("sponsorRecommendations")} ${clubData.clubName}` : t("sponsorRecommendations")}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/tracking">
                  <Button variant="outline" className="cursor-pointer hover:bg-accent transition-colors bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4 flex-shrink-0" />
                    {t("goToTracking")}
                  </Button>
                </Link>
                <LanguageSelector value={language} onValueChange={setLanguage} className="w-36" />
                <ThemeToggle />
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
                    <DemographicsChart clubData={clubData} language={language} />
                  </div>
                  <div className="space-y-4">
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
                          {t("demographicsAnalysis")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{sponsorsData.demographicsAnalysis}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary flex-shrink-0" />
                          {t("recommendedIndustries")}
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
                    <Handshake className="h-8 w-8 text-primary flex-shrink-0" />
                    <h2 className="text-2xl font-bold">{t("potentialSponsors")}</h2>
                    <Badge variant="outline" className="bg-primary/10">
                      {sponsorsData.sponsors.length} {t("matchesFound")}
                    </Badge>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {sponsorsData.sponsors.map((sponsor, index) => (
                      <SponsorCard
                        key={`${language}-${sponsor.name}-${index}`}
                        sponsor={sponsor}
                        clubData={clubData}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {clubData && <AgentAnalyzer clubData={clubData} language={language} />}
    </>
  );
}
