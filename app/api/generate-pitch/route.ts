import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const PitchContentSchema = z.object({
  emailSubject: z.string(),
  emailBody: z.string(),
  slogan: z.string(),
  collaborationIdeas: z.array(z.string()),
  keyBenefits: z.array(z.string()),
  callToAction: z.string(),
})

function generateFallbackPitch(clubData: any, sponsor: any, language = "en") {
  const languageContent = {
    en: {
      emailSubject: `Partnership Opportunity: ${clubData.clubName} & ${sponsor.name}`,
      emailBody: `Dear ${sponsor.name} Team,

I hope this message finds you well. I'm writing to explore an exciting partnership opportunity between ${sponsor.name} and ${clubData.clubName}, a ${clubData.sportType} club based in ${clubData.location}.

Our club has ${clubData.totalMembers} dedicated members who are passionate about ${clubData.sportType} and represent the ${clubData.ageGroups} demographic with a ${clubData.genderSplit} gender distribution. We compete at the ${clubData.competitionLevel} level and are always looking for partners who share our values of excellence and community engagement.

Given ${sponsor.name}'s focus on ${sponsor.industry} and your target audience of ${sponsor.targetAudience}, we believe there's a natural synergy between our organizations. ${sponsor.matchReason}

We would love to discuss how we can create a mutually beneficial partnership that provides value to both our communities. I'd be happy to schedule a call at your convenience to explore the possibilities.

Best regards,
${clubData.clubName} Partnership Team`,
      slogan: `${sponsor.name} & ${clubData.clubName}: Powering Excellence Together`,
      collaborationIdeas: [
        `Co-branded ${clubData.sportType} equipment and merchandise`,
        `Exclusive member discounts and special offers`,
        `Joint community events and tournaments`,
        `Social media cross-promotion campaigns`,
        `Athlete endorsement and testimonial programs`,
      ],
      keyBenefits: [
        `Direct access to ${clubData.totalMembers} engaged ${clubData.sportType} enthusiasts`,
        `Brand visibility at all club events and competitions`,
        `Positive association with health, fitness, and community values`,
        `Authentic content creation opportunities with real athletes`,
      ],
      callToAction: `Let's schedule a 15-minute call this week to discuss how ${sponsor.name} and ${clubData.clubName} can create an impactful partnership. I'm available at your convenience and excited to explore the possibilities together.`,
    },
    fr: {
      emailSubject: `Opportunité de partenariat : ${clubData.clubName} & ${sponsor.name}`,
      emailBody: `Cher équipe ${sponsor.name},

J'espère que ce message vous trouve en bonne santé. Je vous écris pour explorer une opportunité de partenariat passionnante entre ${sponsor.name} et ${clubData.clubName}, un club de ${clubData.sportType} basé à ${clubData.location}.

Notre club compte ${clubData.totalMembers} membres dévoués qui sont passionnés par le ${clubData.sportType} et représentent la démographie ${clubData.ageGroups} avec une répartition de genre ${clubData.genderSplit}. Nous concourons au niveau ${clubData.competitionLevel} et cherchons toujours des partenaires qui partagent nos valeurs d'excellence et d'engagement communautaire.

Étant donné l'accent de ${sponsor.name} sur ${sponsor.industry} et votre public cible de ${sponsor.targetAudience}, nous croyons qu'il y a une synergie naturelle entre nos organisations. ${sponsor.matchReason}

Nous aimerions discuter de la façon dont nous pouvons créer un partenariat mutuellement bénéfique qui apporte de la valeur à nos deux communautés.

Cordialement,
Équipe de partenariat ${clubData.clubName}`,
      slogan: `${sponsor.name} & ${clubData.clubName}: Alimenter l'excellence ensemble`,
      collaborationIdeas: [
        `Équipement et marchandises ${clubData.sportType} co-marqués`,
        `Remises exclusives pour les membres et offres spéciales`,
        `Événements communautaires et tournois conjoints`,
        `Campagnes de promotion croisée sur les réseaux sociaux`,
        `Programmes d'endorsement et de témoignages d'athlètes`,
      ],
      keyBenefits: [
        `Accès direct à ${clubData.totalMembers} passionnés de ${clubData.sportType} engagés`,
        `Visibilité de la marque lors de tous les événements et compétitions du club`,
        `Association positive avec les valeurs de santé, fitness et communauté`,
        `Opportunités de création de contenu authentique avec de vrais athlètes`,
      ],
      callToAction: `Planifions un appel de 15 minutes cette semaine pour discuter de la façon dont ${sponsor.name} et ${clubData.clubName} peuvent créer un partenariat impactant.`,
    },
    de: {
      emailSubject: `Partnerschaftsmöglichkeit: ${clubData.clubName} & ${sponsor.name}`,
      emailBody: `Liebes ${sponsor.name} Team,

Ich hoffe, diese Nachricht erreicht Sie bei bester Gesundheit. Ich schreibe Ihnen, um eine aufregende Partnerschaftsmöglichkeit zwischen ${sponsor.name} und ${clubData.clubName}, einem ${clubData.sportType}-Verein mit Sitz in ${clubData.location}, zu erkunden.

Unser Verein hat ${clubData.totalMembers} engagierte Mitglieder, die leidenschaftlich für ${clubData.sportType} sind und die ${clubData.ageGroups} Demografie mit einer ${clubData.genderSplit} Geschlechterverteilung repräsentieren. Wir konkurrieren auf ${clubData.competitionLevel} Niveau und suchen immer nach Partnern, die unsere Werte von Exzellenz und Gemeinschaftsengagement teilen.

Angesichts des Fokus von ${sponsor.name} auf ${sponsor.industry} und Ihrer Zielgruppe von ${sponsor.targetAudience}, glauben wir, dass es eine natürliche Synergie zwischen unseren Organisationen gibt. ${sponsor.matchReason}

Wir würden gerne besprechen, wie wir eine für beide Seiten vorteilhafte Partnerschaft schaffen können, die beiden Gemeinschaften Wert bietet.

Mit freundlichen Grüßen,
${clubData.clubName} Partnership Team`,
      slogan: `${sponsor.name} & ${clubData.clubName}: Gemeinsam Exzellenz antreiben`,
      collaborationIdeas: [
        `Co-gebrandete ${clubData.sportType} Ausrüstung und Merchandise`,
        `Exklusive Mitgliederrabatte und Sonderangebote`,
        `Gemeinsame Community-Events und Turniere`,
        `Social Media Cross-Promotion Kampagnen`,
        `Athleten-Endorsement und Testimonial-Programme`,
      ],
      keyBenefits: [
        `Direkter Zugang zu ${clubData.totalMembers} engagierten ${clubData.sportType} Enthusiasten`,
        `Markensichtbarkeit bei allen Vereinsveranstaltungen und Wettkämpfen`,
        `Positive Assoziation mit Gesundheits-, Fitness- und Gemeinschaftswerten`,
        `Authentische Content-Erstellungsmöglichkeiten mit echten Athleten`,
      ],
      callToAction: `Lassen Sie uns diese Woche einen 15-minütigen Anruf planen, um zu besprechen, wie ${sponsor.name} und ${clubData.clubName} eine wirkungsvolle Partnerschaft schaffen können.`,
    },
  }

  const content = languageContent[language as keyof typeof languageContent] || languageContent.en
  return content
}

export async function POST(request: NextRequest) {
  try {
    const { clubData, sponsor, language = "en" } = await request.json()

    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const languagePrompts = {
          en: "Generate the content in English",
          fr: "Generate the content in French",
          de: "Generate the content in German",
        }

        const { object } = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: PitchContentSchema,
          prompt: `
            You are a professional marketing copywriter specializing in sponsorship proposals. Create compelling pitch materials for a sports club seeking sponsorship.

            Club Information:
            - Name: ${clubData.clubName}
            - Sport: ${clubData.sportType}
            - Location: ${clubData.location}
            - Total Members: ${clubData.totalMembers}
            - Age Groups: ${clubData.ageGroups}
            - Gender Split: ${clubData.genderSplit}
            - Competition Level: ${clubData.competitionLevel}
            - Additional Info: ${clubData.additionalInfo}

            Target Sponsor:
            - Name: ${sponsor.name}
            - Industry: ${sponsor.industry}
            - Description: ${sponsor.description}
            - Target Audience: ${sponsor.targetAudience}
            - Match Reason: ${sponsor.matchReason}

            ${languagePrompts[language as keyof typeof languagePrompts]}

            Create:
            1. A compelling email subject line
            2. A professional email body (3-4 paragraphs) that highlights mutual benefits
            3. A catchy slogan for the partnership
            4. 4-5 specific collaboration ideas (events, promotions, co-marketing)
            5. 3-4 key benefits for the sponsor
            6. A clear call to action

            Make it professional yet personable, focusing on the value proposition and mutual benefits.
          `,
        })

        return NextResponse.json(object)
      } catch (error: any) {
        lastError = error
        console.error(`[v0] Attempt ${attempt} failed:`, error.message)

        if (
          error.message?.includes("exceeded your current quota") ||
          error.message?.includes("insufficient_quota") ||
          error.message?.includes("rate_limit_exceeded")
        ) {
          console.log(`[v0] OpenAI quota/rate limit hit, using fallback for attempt ${attempt}`)
          break // Don't retry on quota errors, go straight to fallback
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
          console.log(`[v0] Retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    console.log(`[v0] OpenAI failed after ${maxRetries} attempts, using fallback pitch generation`)
    const fallbackPitch = generateFallbackPitch(clubData, sponsor, language)

    return NextResponse.json(fallbackPitch)
  } catch (error) {
    console.error("Error generating pitch:", error)
    return NextResponse.json({ error: "Failed to generate pitch content" }, { status: 500 })
  }
}
