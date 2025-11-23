"use client";

import { useState } from "react";
import { Activity, AlertCircle, Bot, BookmarkPlus, CheckCircle2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { evaluateBusinessWithAgent } from "@/lib/api";
import type { AgentEvaluationResult, AgentWorkflowLog, ClubData, Language, TrackedSponsor } from "@/lib/types";
import SponsorCard from "@/components/sponsor-card";
import { UserStorage } from "@/lib/user-storage";
import { useTranslation } from "@/lib/i18n";

interface AgentAnalyzerProps {
  clubData: ClubData;
  language: Language;
}

export default function AgentAnalyzer({ clubData, language }: AgentAnalyzerProps) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<AgentWorkflowLog[]>([]);
  const [evaluation, setEvaluation] = useState<AgentEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackingMessage, setTrackingMessage] = useState<"added" | "exists" | null>(null);
  const { t } = useTranslation(language);

  const handleAnalyze = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!companyName.trim()) {
      setError(t("agentProvideCompanyError"));
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setEvaluation(null);
    setError(null);
    setTrackingMessage(null);

    try {
      const result = await evaluateBusinessWithAgent(companyName.trim(), clubData, language);
      setLogs(result.logs);
      setEvaluation(result);
    } catch (err) {
      const agentLogs = (err as any)?.logs as AgentWorkflowLog[] | undefined;
      if (agentLogs) {
        setLogs(agentLogs);
      }
      setError(err instanceof Error ? err.message : t("agentErrorGeneric"));
    } finally {
      setIsRunning(false);
    }
  };

  const handleAddToTracking = () => {
    if (!evaluation) return;
    const sponsor = evaluation.trackingPayload.sponsor;
    const trackedSponsor: TrackedSponsor = {
      ...sponsor,
      id: `${sponsor.name}-${Date.now()}`,
      status: "Not Contacted",
      dateAdded: new Date().toISOString(),
      clubData,
    };

    const success = UserStorage.addTrackedSponsor(trackedSponsor);
    setTrackingMessage(success ? "added" : "exists");
  };

  const getLogIcon = (status: AgentWorkflowLog["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-lg flex items-center gap-2 z-40"
          title={t("agentButton")}
        >
          <Bot className="h-5 w-5 flex-shrink-0" />
          {t("agentButton")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary flex-shrink-0" />
            {t("agentDialogTitle")}
          </DialogTitle>
          <DialogDescription>{t("agentDialogDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1 space-y-1">
              <Input
                placeholder={t("agentInputPlaceholder")}
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">{t("agentInputHelper")}</p>
            </div>
            <Button type="submit" disabled={isRunning} className="md:w-auto w-full">
              {isRunning ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  {t("agentRunning")}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  {t("agentAnalyze")}
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary flex-shrink-0" />
                {t("agentWorkflowTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {logs.length === 0 && !isRunning && (
                <p className="text-sm text-muted-foreground">{t("agentWorkflowEmpty")}</p>
              )}
              {(isRunning || logs.length > 0) && (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-2 rounded-md border p-2 text-sm ${
                        log.status === "success"
                          ? "border-emerald-600/30 bg-emerald-500/5"
                          : log.status === "error"
                          ? "border-destructive/50 bg-destructive/5"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      {getLogIcon(log.status)}
                      <div>
                        <p className="font-medium">{log.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-2 text-sm">
                      <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0 animate-pulse" />
                      <div>
                        <p className="font-medium">{t("agentWorkflowWorking")}</p>
                        <p className="text-xs text-muted-foreground">{t("agentWorkflowWorkingDetail")}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {evaluation && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-xl">{evaluation.businessInfo.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        <a
                          href={evaluation.businessInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                        >
                          {evaluation.businessInfo.website}
                        </a>
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-base">
                      {t("agentFitScoreLabel")} {evaluation.fit.score}/100
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{evaluation.finalSummary}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">{t("agentSuggestedTypeLabel")}</p>
                      <p className="font-semibold">{evaluation.fit.suggestedSponsorshipType}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">{t("industryLabel")}</p>
                      <p className="font-semibold">{evaluation.profile.industry}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">{t("agentFitReasonsLabel")}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {evaluation.fit.fitReasons.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.trackingPayload.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{t("agentPitchInstructions")}</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={handleAddToTracking} disabled={trackingMessage === "added"}>
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      {t("agentAddToTracking")}
                    </Button>
                    {trackingMessage && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {trackingMessage === "added" ? t("agentTrackingAdded") : t("agentTrackingExists")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("agentFullSponsorCard")}</h3>
                <SponsorCard sponsor={evaluation.trackingPayload.sponsor} clubData={clubData} language={language} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
