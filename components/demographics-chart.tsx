"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Calendar, MapPin } from "lucide-react"
import type { ClubData } from "@/lib/types"

interface DemographicsChartProps {
  clubData: ClubData
}

export default function DemographicsChart({ clubData }: DemographicsChartProps) {
  // Transform club data into chart data
  const getAgeGroupData = () => {
    const ageGroupMap: Record<string, { name: string; value: number; color: string }> = {
      youth: { name: "Youth (6-17)", value: 35, color: "hsl(var(--chart-1))" },
      "young-adult": { name: "Young Adult (18-25)", value: 25, color: "hsl(var(--chart-2))" },
      adult: { name: "Adult (26-40)", value: 30, color: "hsl(var(--chart-3))" },
      senior: { name: "Senior (40+)", value: 10, color: "hsl(var(--chart-4))" },
      mixed: { name: "Mixed Ages", value: 100, color: "hsl(var(--chart-1))" },
    }

    if (clubData.ageGroups === "mixed") {
      return [
        { name: "Youth (6-17)", value: 25, color: "hsl(var(--chart-1))" },
        { name: "Young Adult (18-25)", value: 30, color: "hsl(var(--chart-2))" },
        { name: "Adult (26-40)", value: 35, color: "hsl(var(--chart-3))" },
        { name: "Senior (40+)", value: 10, color: "hsl(var(--chart-4))" },
      ]
    }

    return [ageGroupMap[clubData.ageGroups] || ageGroupMap["mixed"]]
  }

  const getGenderData = () => {
    const genderMap: Record<string, Array<{ name: string; value: number; color: string }>> = {
      "male-majority": [
        { name: "Male", value: 75, color: "hsl(var(--chart-1))" },
        { name: "Female", value: 25, color: "hsl(var(--chart-2))" },
      ],
      "female-majority": [
        { name: "Female", value: 75, color: "hsl(var(--chart-2))" },
        { name: "Male", value: 25, color: "hsl(var(--chart-1))" },
      ],
      balanced: [
        { name: "Male", value: 50, color: "hsl(var(--chart-1))" },
        { name: "Female", value: 50, color: "hsl(var(--chart-2))" },
      ],
      mixed: [
        { name: "Male", value: 55, color: "hsl(var(--chart-1))" },
        { name: "Female", value: 45, color: "hsl(var(--chart-2))" },
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
        <div className="bg-background border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Club Demographics Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Club Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{clubData.totalMembers}</div>
              <div className="text-xs text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold capitalize">{clubData.sportType}</div>
              <div className="text-xs text-muted-foreground">Sport</div>
            </div>
            <div className="text-center flex flex-col items-center">
              <Badge className={getCompetitionLevelColor()}>{clubData.competitionLevel}</Badge>
              <div className="text-xs text-muted-foreground mt-1">Level</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{clubData.location}</span>
              </div>
              <div className="text-xs text-muted-foreground">Location</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Age Groups Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Age Distribution
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
                        paddingAngle={2}
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={ageGroupData[0]?.color} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {ageGroupData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Distribution Chart */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Gender Distribution
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
                      paddingAngle={2}
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
              <div className="flex flex-wrap gap-2 mt-2">
                {genderData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {clubData.additionalInfo && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Additional Club Information</h4>
              <p className="text-sm text-muted-foreground">{clubData.additionalInfo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
