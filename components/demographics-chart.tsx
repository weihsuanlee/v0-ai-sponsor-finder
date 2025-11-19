"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapPin, Users, Calendar, Scale } from "lucide-react"
import type { ClubData } from "@/lib/types"
import { useTranslation, type Language } from "@/lib/i18n"

interface DemographicsChartProps {
  clubData: ClubData
  language: Language
}

export default function DemographicsChart({ clubData, language }: DemographicsChartProps) {
  const { t } = useTranslation(language)
  const chartColors = [
    "oklch(0.5106 0.2301 276.9656)", // Primary purple
    "oklch(0.7038 0.1230 182.5025)", // Secondary teal
    "oklch(0.7686 0.1647 70.0804)", // Accent yellow
    "oklch(0.7451 0.1372 342.5537)", // Chart pink
    "oklch(0.6863 0.1686 142.4956)", // Chart green
  ]

  // Transform club data into chart data
  const getAgeGroupData = () => {
    // If uploaded demographics are available, use exact data
    if (clubData.uploadedDemographics) {
      const { ageDistributionPercentages } = clubData.uploadedDemographics
      return [
        { name: t("youth"), value: ageDistributionPercentages.youth, color: chartColors[0] },
        { name: t("young-adult"), value: ageDistributionPercentages.youngAdult, color: chartColors[1] },
        { name: t("adult"), value: ageDistributionPercentages.adult, color: chartColors[2] },
        { name: t("senior"), value: ageDistributionPercentages.senior, color: chartColors[3] },
      ].filter((item) => item.value > 0) // Only show groups with members
    }

    // Fallback to estimated data
    const ageGroupMap: Record<string, { name: string; value: number; color: string }> = {
      youth: { name: t("youth"), value: 35, color: chartColors[0] },
      "young-adult": { name: t("young-adult"), value: 25, color: chartColors[1] },
      adult: { name: t("adult"), value: 30, color: chartColors[2] },
      senior: { name: t("senior"), value: 10, color: chartColors[3] },
      mixed: { name: t("mixed"), value: 100, color: chartColors[0] },
    }

    if (clubData.ageGroups === "mixed") {
      return [
        { name: t("youth"), value: 25, color: chartColors[0] },
        { name: t("young-adult"), value: 30, color: chartColors[1] },
        { name: t("adult"), value: 35, color: chartColors[2] },
        { name: t("senior"), value: 10, color: chartColors[3] },
      ]
    }

    return [ageGroupMap[clubData.ageGroups] || ageGroupMap["mixed"]]
  }

  const getGenderData = () => {
    // If uploaded demographics are available, use exact data
    if (clubData.uploadedDemographics) {
      const { genderDistributionPercentages } = clubData.uploadedDemographics
      return [
        { name: t("male"), value: genderDistributionPercentages.male, color: chartColors[0] },
        { name: t("female"), value: genderDistributionPercentages.female, color: chartColors[1] },
        { name: t("other"), value: genderDistributionPercentages.other, color: chartColors[4] },
      ].filter((item) => item.value > 0) // Only show categories with members
    }

    // Fallback to estimated data
    const genderMap: Record<string, Array<{ name: string; value: number; color: string }>> = {
      "male-majority": [
        { name: t("male"), value: 75, color: chartColors[0] }, // Purple for male
        { name: t("female"), value: 25, color: chartColors[1] }, // Teal for female
      ],
      "female-majority": [
        { name: t("female"), value: 75, color: chartColors[1] }, // Teal for female
        { name: t("male"), value: 25, color: chartColors[0] }, // Purple for male
      ],
      balanced: [
        { name: t("male"), value: 50, color: chartColors[0] }, // Purple for male
        { name: t("female"), value: 50, color: chartColors[1] }, // Teal for female
      ],
      mixed: [
        { name: t("male"), value: 55, color: chartColors[0] }, // Purple for male
        { name: t("female"), value: 45, color: chartColors[1] }, // Teal for female
      ],
    }

    return genderMap[clubData.genderSplit] || genderMap["mixed"]
  }

  const getCompetitionLevelColor = () => {
    const levelMap: Record<string, string> = {
      recreational: "bg-blue-100 text-blue-800",
      amateur: "bg-green-100 text-green-800",
      "semi-professional": "bg-yellow-100 text-yellow-800",
      professional: "bg-purple-100 text-purple-800",
    }
    return levelMap[clubData.competitionLevel] || "bg-gray-100 text-gray-800"
  }

  const ageGroupData = getAgeGroupData()
  const genderData = getGenderData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg border-primary/20">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-2 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary flex-shrink-0" />
          {t("clubDemographicsOverview")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Club Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">{clubData.totalMembers}</div>
              <div className="text-xs text-muted-foreground">{t("totalMembers")}</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-lg font-semibold capitalize text-primary">{clubData.sportType}</div>
              <div className="text-xs text-muted-foreground">{t("sportType")}</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20 flex flex-col items-center">
              <Badge className={getCompetitionLevelColor()}>{clubData.competitionLevel}</Badge>
              <div className="text-xs text-muted-foreground mt-1">{t("competitionLevelLabel")}</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-1 text-sm">
                <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="truncate">{clubData.location}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t("location")}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Age Groups Chart */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                {t("ageDistribution")}
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  {ageGroupData.length > 1 ? (
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`age-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  ) : (
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5106 0.2301 276.9656)" strokeOpacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={ageGroupData[0]?.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {ageGroupData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs bg-background/80 px-2 py-1 rounded-full border"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Distribution Chart */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary flex-shrink-0" />
                {t("genderDistribution")}
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`gender-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {genderData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs bg-background/80 px-2 py-1 rounded-full border"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {clubData.additionalInfo && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary flex-shrink-0" />
                {t("additionalClubInfo")}
              </h4>
              <p className="text-sm text-muted-foreground">{clubData.additionalInfo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
