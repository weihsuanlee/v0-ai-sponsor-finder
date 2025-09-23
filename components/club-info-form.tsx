"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Users, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation, type Language } from "@/lib/i18n"
import { UserStorage } from "@/lib/user-storage"

export interface ClubData {
  clubName: string
  sportType: string
  location: string
  totalMembers: number
  ageGroups: string
  genderSplit: string
  competitionLevel: string
  additionalInfo: string
}

interface ClubInfoFormProps {
  language: Language
}

export default function ClubInfoForm({ language }: ClubInfoFormProps) {
  const router = useRouter()
  const { t } = useTranslation(language)
  const [formData, setFormData] = useState<ClubData>({
    clubName: "",
    sportType: "",
    location: "",
    totalMembers: 0,
    ageGroups: "",
    genderSplit: "",
    competitionLevel: "",
    additionalInfo: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof ClubData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      UserStorage.updateSession(formData)
      localStorage.setItem("selectedLanguage", language)

      // Navigate to results page
      router.push("/results")
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.clubName && formData.sportType && formData.location && formData.totalMembers > 0

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Club Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clubName">{t("clubName")} *</Label>
            <Input
              id="clubName"
              placeholder="e.g., Manchester United FC"
              value={formData.clubName}
              onChange={(e) => handleInputChange("clubName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sportType">{t("sportType")} *</Label>
            <Select value={formData.sportType} onValueChange={(value) => handleInputChange("sportType", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("sportType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">{t("football")}</SelectItem>
                <SelectItem value="basketball">{t("basketball")}</SelectItem>
                <SelectItem value="tennis">{t("tennis")}</SelectItem>
                <SelectItem value="rugby">{t("rugby")}</SelectItem>
                <SelectItem value="cricket">{t("cricket")}</SelectItem>
                <SelectItem value="volleyball">{t("volleyball")}</SelectItem>
                <SelectItem value="hockey">{t("hockey")}</SelectItem>
                <SelectItem value="baseball">{t("baseball")}</SelectItem>
                <SelectItem value="swimming">{t("swimming")}</SelectItem>
                <SelectItem value="athletics">{t("athletics")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">{t("location")} *</Label>
            <Input
              id="location"
              placeholder="e.g., Manchester, UK"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalMembers">{t("totalMembers")} *</Label>
            <Input
              id="totalMembers"
              type="number"
              placeholder="e.g., 150"
              value={formData.totalMembers || ""}
              onChange={(e) => handleInputChange("totalMembers", Number.parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </div>

        {/* Demographics Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("memberDemographics")}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageGroups">{t("primaryAgeGroups")}</Label>
              <Select value={formData.ageGroups} onValueChange={(value) => handleInputChange("ageGroups", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("primaryAgeGroups")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youth">{t("youth")}</SelectItem>
                  <SelectItem value="young-adult">{t("young-adult")}</SelectItem>
                  <SelectItem value="adult">{t("adult")}</SelectItem>
                  <SelectItem value="senior">{t("senior")}</SelectItem>
                  <SelectItem value="mixed">{t("mixed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genderSplit">{t("genderDistribution")}</Label>
              <Select value={formData.genderSplit} onValueChange={(value) => handleInputChange("genderSplit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("genderDistribution")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male-majority">{t("male-majority")}</SelectItem>
                  <SelectItem value="female-majority">{t("female-majority")}</SelectItem>
                  <SelectItem value="balanced">{t("balanced")}</SelectItem>
                  <SelectItem value="mixed">{t("mixed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competitionLevel">{t("competitionLevel")}</Label>
              <Select
                value={formData.competitionLevel}
                onValueChange={(value) => handleInputChange("competitionLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("competitionLevel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recreational">{t("recreational")}</SelectItem>
                  <SelectItem value="amateur">{t("amateur")}</SelectItem>
                  <SelectItem value="semi-professional">{t("semi-professional")}</SelectItem>
                  <SelectItem value="professional">{t("professional")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* File Upload Option */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Upload member data file (CSV, Excel)</p>
            <p className="text-xs text-muted-foreground">
              We'll automatically extract demographics while keeping sensitive data private
            </p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" type="button">
              Choose File
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-2">
          <Label htmlFor="additionalInfo">{t("additionalInfo")}</Label>
          <Textarea
            id="additionalInfo"
            placeholder={t("additionalInfoPlaceholder")}
            rows={4}
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <Button type="submit" size="lg" className="text-lg px-12" disabled={!isFormValid || isLoading}>
            {isLoading ? "Finding Sponsors..." : t("findSponsors")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
