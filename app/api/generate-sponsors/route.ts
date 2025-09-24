import { type NextRequest, NextResponse } from "next/server"

function generateMockSponsors(clubData: any) {
  const baseSponsors = [
    {
      name: `${clubData.location} Sports Equipment Co.`,
      industry: "Sports Equipment",
      description:
        "Local sports equipment retailer specializing in quality gear for amateur and professional athletes.",
      targetAudience: "Sports enthusiasts and athletes",
      sponsorshipBudget: "€2,000 - €5,000",
      contactInfo: {
        website: "www.sportsco.com",
        email: "partnerships@sportsco.com",
      },
      matchReason: `Perfect match for ${clubData.sportType} clubs, with a focus on supporting local sports communities.`,
    },
    {
      name: "FitLife Nutrition",
      industry: "Health & Nutrition",
      description: "Premium sports nutrition and supplement company focused on athletic performance.",
      targetAudience: "Athletes and fitness enthusiasts",
      sponsorshipBudget: "€3,000 - €7,000",
      contactInfo: {
        website: "www.fitlifenutrition.com",
        email: "sponsorship@fitlife.com",
      },
      matchReason: "Aligns with health-conscious athletes and can provide nutrition support for team members.",
    },
    {
      name: `${clubData.location} Community Bank`,
      industry: "Financial Services",
      description: "Local community bank committed to supporting regional sports and youth development.",
      targetAudience: "Local community members",
      sponsorshipBudget: "€5,000 - €10,000",
      contactInfo: {
        website: "www.communitybank.com",
        email: "community@bank.com",
      },
      matchReason: "Strong community presence and commitment to supporting local sports initiatives.",
    },
    {
      name: "ActiveWear Pro",
      industry: "Sportswear",
      description: "Athletic apparel brand specializing in performance wear for various sports.",
      targetAudience: "Athletes and sports teams",
      sponsorshipBudget: "€4,000 - €8,000",
      contactInfo: {
        website: "www.activewearpro.com",
        email: "teams@activewearpro.com",
      },
      matchReason: `Excellent opportunity to showcase their ${clubData.sportType} apparel line with your team.`,
    },
    {
      name: "TechFlow Solutions",
      industry: "Technology",
      description: "Local IT services company providing digital solutions for businesses and organizations.",
      targetAudience: "Tech-savvy professionals",
      sponsorshipBudget: "€2,500 - €6,000",
      contactInfo: {
        website: "www.techflow.com",
        email: "marketing@techflow.com",
      },
      matchReason: "Looking to increase brand visibility in the local community and support youth development.",
    },
    {
      name: "Green Energy Partners",
      industry: "Renewable Energy",
      description: "Sustainable energy solutions company with a focus on environmental responsibility.",
      targetAudience: "Environmentally conscious consumers",
      sponsorshipBudget: "€3,500 - €7,500",
      contactInfo: {
        website: "www.greenenergypartners.com",
        email: "partnerships@greenergy.com",
      },
      matchReason:
        "Aligns with community values and provides positive brand association with healthy, active lifestyles.",
    },
  ]

  const sportSpecificSponsors = {
    basketball: [
      {
        name: "Court Kings Equipment",
        industry: "Sports Equipment",
        description: "Specialized basketball equipment and court accessories supplier.",
        targetAudience: "Basketball players and teams",
        sponsorshipBudget: "€3,000 - €6,000",
        contactInfo: {
          website: "www.courtkings.com",
          email: "team@courtkings.com",
        },
        matchReason: "Dedicated to supporting basketball communities with high-quality equipment and gear.",
      },
    ],
    tennis: [
      {
        name: "Racquet Masters",
        industry: "Sports Equipment",
        description: "Premium tennis equipment and accessories retailer.",
        targetAudience: "Tennis players and clubs",
        sponsorshipBudget: "€2,500 - €5,500",
        contactInfo: {
          website: "www.racquetmasters.com",
          email: "clubs@racquetmasters.com",
        },
        matchReason: "Specializes in tennis equipment and has a strong track record of supporting tennis clubs.",
      },
    ],
    football: [
      {
        name: "Goal Line Sports",
        industry: "Sports Equipment",
        description: "Football equipment and training gear specialist.",
        targetAudience: "Football teams and players",
        sponsorshipBudget: "€4,000 - €8,000",
        contactInfo: {
          website: "www.goallinesports.com",
          email: "teams@goallinesports.com",
        },
        matchReason: "Passionate about supporting football clubs with top-quality equipment and training resources.",
      },
    ],
  }

  const sportType = clubData.sportType?.toLowerCase()
  const additionalSponsors = sportSpecificSponsors[sportType as keyof typeof sportSpecificSponsors] || []

  const allSponsors = [...baseSponsors, ...additionalSponsors]

  const demographicsAnalysis = `Your ${clubData.sportType} club in ${clubData.location} with ${clubData.totalMembers} members represents an attractive sponsorship opportunity. The ${clubData.ageGroups} age demographic and ${clubData.genderSplit} gender distribution appeals to brands targeting active, health-conscious consumers. The ${clubData.competitionLevel} competition level indicates dedicated athletes who influence purchasing decisions in sports and lifestyle categories.`

  const recommendedIndustries = [
    "Sports Equipment",
    "Health & Nutrition",
    "Financial Services",
    "Sportswear & Apparel",
    "Local Businesses",
    "Technology",
    "Automotive",
    "Food & Beverage",
  ]

  return {
    sponsors: allSponsors,
    demographicsAnalysis,
    recommendedIndustries,
  }
}

export async function POST(request: NextRequest) {
  try {
    const clubData = await request.json()
    console.log("[v0] Received club data:", clubData)

    const sponsorData = generateMockSponsors(clubData)
    console.log("[v0] Generated sponsor data successfully")

    return NextResponse.json(sponsorData)
  } catch (error) {
    console.error("Error generating sponsors:", error)
    return NextResponse.json({ error: "Failed to generate sponsor recommendations" }, { status: 500 })
  }
}
