"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Upload, FileSpreadsheet, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation, type Language } from "@/lib/i18n"
import { UserStorage } from "@/lib/user-storage"
import FileUpload from "@/components/file-upload"
import type { ParsedMemberData } from "@/lib/types"

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
  const [uploadedData, setUploadedData] = useState<ParsedMemberData | null>(null)
  const [useFileUpload, setUseFileUpload] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof ClubData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileDataParsed = (data: ParsedMemberData) => {
    setUploadedData(data)
    // Auto-fill form fields from uploaded data and save demographics
    setFormData((prev) => ({
      ...prev,
      totalMembers: data.totalMembers,
      ageGroups: data.dominantAgeGroup,
      genderSplit: data.dominantGender,
      uploadedDemographics: {
        ageDistribution: data.ageDistribution,
        ageDistributionPercentages: data.ageDistributionPercentages,
        genderDistribution: data.genderDistribution,
        genderDistributionPercentages: data.genderDistributionPercentages,
      },
    }))
  }

  const handleClearUpload = () => {
    setUploadedData(null)
    setUseFileUpload(false)
    // Clear auto-filled fields
    setFormData((prev) => ({
      ...prev,
      totalMembers: 0,
      ageGroups: "",
      genderSplit: "",
    }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.clubName.trim()) {
      errors.clubName = "Club name is required"
    }
    if (!formData.sportType) {
      errors.sportType = "Sport type is required"
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required"
    }
    if (!formData.totalMembers || formData.totalMembers <= 0) {
      errors.totalMembers = "Total members must be greater than 0"
    }

    setValidationErrors(errors)

    // Scroll to first error
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.focus()
      }
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

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
              className={validationErrors.clubName ? "border-red-500" : ""}
            />
            {validationErrors.clubName && (
              <p className="text-sm text-red-600">{validationErrors.clubName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sportType">{t("sportType")} *</Label>
            <Select value={formData.sportType} onValueChange={(value) => handleInputChange("sportType", value)}>
              <SelectTrigger id="sportType" className={validationErrors.sportType ? "border-red-500" : ""}>
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
            {validationErrors.sportType && (
              <p className="text-sm text-red-600">{validationErrors.sportType}</p>
            )}
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
              className={validationErrors.location ? "border-red-500" : ""}
            />
            {validationErrors.location && (
              <p className="text-sm text-red-600">{validationErrors.location}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalMembers">{t("totalMembers")} *</Label>
            <Input
              id="totalMembers"
              type="number"
              placeholder="e.g., 150"
              value={formData.totalMembers || ""}
              onChange={(e) => handleInputChange("totalMembers", Number.parseInt(e.target.value) || 0)}
              className={validationErrors.totalMembers ? "border-red-500" : ""}
            />
            {validationErrors.totalMembers && (
              <p className="text-sm text-red-600">{validationErrors.totalMembers}</p>
            )}
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

          {!useFileUpload ? (
            <div className="text-center p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Upload member data file (CSV, Excel)</p>
              <p className="text-xs text-muted-foreground mb-4">
                We'll automatically extract demographics while keeping sensitive data private
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 bg-transparent"
                type="button"
                onClick={() => setUseFileUpload(true)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <FileUpload onDataParsed={handleFileDataParsed} onClear={handleClearUpload} />

              {uploadedData && (
                <Card className="border-green-500 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="font-medium text-sm">Member data parsed successfully!</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {uploadedData.totalMembers} members analyzed. Form fields have been auto-filled.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="font-medium text-muted-foreground">Age Distribution</p>
                            <div className="mt-1 space-y-0.5">
                              <p>Youth (6-17): {uploadedData.ageDistributionPercentages.youth}%</p>
                              <p>Young Adult (18-25): {uploadedData.ageDistributionPercentages.youngAdult}%</p>
                              <p>Adult (26-40): {uploadedData.ageDistributionPercentages.adult}%</p>
                              <p>Senior (40+): {uploadedData.ageDistributionPercentages.senior}%</p>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium text-muted-foreground">Gender Distribution</p>
                            <div className="mt-1 space-y-0.5">
                              <p>Male: {uploadedData.genderDistributionPercentages.male}%</p>
                              <p>Female: {uploadedData.genderDistributionPercentages.female}%</p>
                              <p>Other: {uploadedData.genderDistributionPercentages.other}%</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <Badge variant="secondary" className="text-xs">
                            <FileSpreadsheet className="mr-1 h-3 w-3" />
                            You can still manually adjust the fields below
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
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
          <Button type="submit" size="lg" className="text-lg px-12" disabled={isLoading}>
            {isLoading ? "Finding Sponsors..." : t("findSponsors")}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
