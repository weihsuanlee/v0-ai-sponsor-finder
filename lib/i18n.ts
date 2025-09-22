export type Language = "en" | "fr" | "de"

export const languages = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
} as const

export const translations = {
  en: {
    // Navigation
    backToHome: "Back to Home",

    // Hero Section
    heroTitle: "Connect Your Sports Club with Perfect Sponsors",
    heroSubtitle:
      "Our AI analyzes your club's demographics and generates personalized sponsor recommendations with ready-to-send pitch materials in multiple languages.",
    getStarted: "Get Started",
    seeHowItWorks: "See How It Works",

    // Features
    whyChoose: "Why Choose AI Sponsor Finder?",
    featuresSubtitle: "Transform your sponsorship search with intelligent matching and professional pitch materials",
    smartMatching: "Smart Matching",
    smartMatchingDesc:
      "AI analyzes your club demographics to find sponsors whose target audience aligns with your members",
    instantPitch: "Instant Pitch Materials",
    instantPitchDesc:
      "Generate professional emails, slogans, and collaboration ideas tailored to each potential sponsor",
    multiLanguage: "Multi-Language Support",
    multiLanguageDesc:
      "Create pitch materials in English, French, and German to reach sponsors across different markets",

    // Form
    tellUsAboutClub: "Tell Us About Your Club",
    formSubtitle: "Provide your club details to get personalized sponsor recommendations",
    clubName: "Club Name",
    sportType: "Sport Type",
    location: "Location (City/Region)",
    totalMembers: "Total Members",
    memberDemographics: "Member Demographics",
    primaryAgeGroups: "Primary Age Groups",
    genderDistribution: "Gender Distribution",
    competitionLevel: "Competition Level",
    additionalInfo: "Additional Information (Optional)",
    additionalInfoPlaceholder:
      "Tell us about your club's achievements, community involvement, or any special characteristics that might interest sponsors...",
    findSponsors: "Find Potential Sponsors",

    // Results
    sponsorRecommendations: "Sponsor Recommendations for",
    demographicsAnalysis: "Demographics Analysis",
    recommendedIndustries: "Recommended Industries",
    potentialSponsors: "Potential Sponsors",
    matchesFound: "matches found",

    // Sponsor Card
    whyTheyWouldSponsor: "Why they'd sponsor you:",
    website: "Website",
    email: "Email",
    aiPitchMaterials: "AI Pitch Materials",
    generatePitchMaterials: "Generate Pitch Materials",
    generatedIn: "Generated in",
    regenerate: "Regenerate",
    emailSubject: "Email Subject",
    emailBody: "Email Body",
    partnershipSlogan: "Partnership Slogan",
    keyBenefits: "Key Benefits for Sponsor",
    collaborationIdeas: "Collaboration Ideas",
    callToAction: "Call to Action",

    // Demographics
    clubDemographicsOverview: "Club Demographics Overview",
    ageDistribution: "Age Distribution",
    additionalClubInfo: "Additional Club Information",

    // Footer
    footerText: "© 2024 AI Sponsor Finder. Connecting sports clubs with perfect sponsors through intelligent matching.",

    // Sports
    football: "Football/Soccer",
    basketball: "Basketball",
    tennis: "Tennis",
    rugby: "Rugby",
    cricket: "Cricket",
    volleyball: "Volleyball",
    hockey: "Hockey",
    baseball: "Baseball",
    swimming: "Swimming",
    athletics: "Athletics/Track & Field",
    other: "Other",

    // Age Groups
    youth: "Youth (6-17)",
    "young-adult": "Young Adult (18-25)",
    adult: "Adult (26-40)",
    senior: "Senior (40+)",
    mixed: "Mixed Ages",

    // Gender
    "male-majority": "Mostly Male (70%+)",
    "female-majority": "Mostly Female (70%+)",
    balanced: "Balanced (40-60%)",

    // Competition Levels
    recreational: "Recreational",
    amateur: "Amateur",
    "semi-professional": "Semi-Professional",
    professional: "Professional",
  },

  fr: {
    // Navigation
    backToHome: "Retour à l'accueil",

    // Hero Section
    heroTitle: "Connectez votre club sportif avec des sponsors parfaits",
    heroSubtitle:
      "Notre IA analyse les données démographiques de votre club et génère des recommandations de sponsors personnalisées avec des supports de présentation prêts à envoyer en plusieurs langues.",
    getStarted: "Commencer",
    seeHowItWorks: "Voir comment ça marche",

    // Features
    whyChoose: "Pourquoi choisir AI Sponsor Finder ?",
    featuresSubtitle:
      "Transformez votre recherche de sponsors avec un matching intelligent et des supports de présentation professionnels",
    smartMatching: "Matching intelligent",
    smartMatchingDesc:
      "L'IA analyse les données démographiques de votre club pour trouver des sponsors dont le public cible correspond à vos membres",
    instantPitch: "Supports de présentation instantanés",
    instantPitchDesc:
      "Générez des emails professionnels, des slogans et des idées de collaboration adaptés à chaque sponsor potentiel",
    multiLanguage: "Support multilingue",
    multiLanguageDesc:
      "Créez des supports de présentation en anglais, français et allemand pour atteindre les sponsors sur différents marchés",

    // Form
    tellUsAboutClub: "Parlez-nous de votre club",
    formSubtitle: "Fournissez les détails de votre club pour obtenir des recommandations de sponsors personnalisées",
    clubName: "Nom du club",
    sportType: "Type de sport",
    location: "Localisation (Ville/Région)",
    totalMembers: "Nombre total de membres",
    memberDemographics: "Données démographiques des membres",
    primaryAgeGroups: "Groupes d'âge principaux",
    genderDistribution: "Répartition par sexe",
    competitionLevel: "Niveau de compétition",
    additionalInfo: "Informations supplémentaires (Optionnel)",
    additionalInfoPlaceholder:
      "Parlez-nous des réalisations de votre club, de son implication communautaire ou de toute caractéristique spéciale qui pourrait intéresser les sponsors...",
    findSponsors: "Trouver des sponsors potentiels",

    // Results
    sponsorRecommendations: "Recommandations de sponsors pour",
    demographicsAnalysis: "Analyse démographique",
    recommendedIndustries: "Industries recommandées",
    potentialSponsors: "Sponsors potentiels",
    matchesFound: "correspondances trouvées",

    // Sponsor Card
    whyTheyWouldSponsor: "Pourquoi ils vous sponsoriseraient :",
    website: "Site web",
    email: "Email",
    aiPitchMaterials: "Supports de présentation IA",
    generatePitchMaterials: "Générer les supports de présentation",
    generatedIn: "Généré en",
    regenerate: "Régénérer",
    emailSubject: "Objet de l'email",
    emailBody: "Corps de l'email",
    partnershipSlogan: "Slogan du partenariat",
    keyBenefits: "Avantages clés pour le sponsor",
    collaborationIdeas: "Idées de collaboration",
    callToAction: "Appel à l'action",

    // Demographics
    clubDemographicsOverview: "Aperçu démographique du club",
    ageDistribution: "Répartition par âge",
    additionalClubInfo: "Informations supplémentaires sur le club",

    // Footer
    footerText:
      "© 2024 AI Sponsor Finder. Connecter les clubs sportifs avec des sponsors parfaits grâce au matching intelligent.",

    // Sports
    football: "Football",
    basketball: "Basketball",
    tennis: "Tennis",
    rugby: "Rugby",
    cricket: "Cricket",
    volleyball: "Volleyball",
    hockey: "Hockey",
    baseball: "Baseball",
    swimming: "Natation",
    athletics: "Athlétisme",
    other: "Autre",

    // Age Groups
    youth: "Jeunes (6-17)",
    "young-adult": "Jeunes adultes (18-25)",
    adult: "Adultes (26-40)",
    senior: "Seniors (40+)",
    mixed: "Âges mixtes",

    // Gender
    "male-majority": "Majoritairement masculin (70%+)",
    "female-majority": "Majoritairement féminin (70%+)",
    balanced: "Équilibré (40-60%)",

    // Competition Levels
    recreational: "Récréatif",
    amateur: "Amateur",
    "semi-professional": "Semi-professionnel",
    professional: "Professionnel",
  },

  de: {
    // Navigation
    backToHome: "Zurück zur Startseite",

    // Hero Section
    heroTitle: "Verbinden Sie Ihren Sportverein mit perfekten Sponsoren",
    heroSubtitle:
      "Unsere KI analysiert die Demografie Ihres Vereins und generiert personalisierte Sponsor-Empfehlungen mit versandfertigen Präsentationsmaterialien in mehreren Sprachen.",
    getStarted: "Loslegen",
    seeHowItWorks: "Wie es funktioniert",

    // Features
    whyChoose: "Warum AI Sponsor Finder wählen?",
    featuresSubtitle:
      "Transformieren Sie Ihre Sponsorensuche mit intelligentem Matching und professionellen Präsentationsmaterialien",
    smartMatching: "Intelligentes Matching",
    smartMatchingDesc:
      "KI analysiert die Demografie Ihres Vereins, um Sponsoren zu finden, deren Zielgruppe mit Ihren Mitgliedern übereinstimmt",
    instantPitch: "Sofortige Präsentationsmaterialien",
    instantPitchDesc:
      "Generieren Sie professionelle E-Mails, Slogans und Kooperationsideen, die auf jeden potenziellen Sponsor zugeschnitten sind",
    multiLanguage: "Mehrsprachige Unterstützung",
    multiLanguageDesc:
      "Erstellen Sie Präsentationsmaterialien auf Englisch, Französisch und Deutsch, um Sponsoren in verschiedenen Märkten zu erreichen",

    // Form
    tellUsAboutClub: "Erzählen Sie uns von Ihrem Verein",
    formSubtitle: "Geben Sie Ihre Vereinsdetails an, um personalisierte Sponsor-Empfehlungen zu erhalten",
    clubName: "Vereinsname",
    sportType: "Sportart",
    location: "Standort (Stadt/Region)",
    totalMembers: "Gesamtmitglieder",
    memberDemographics: "Mitgliederdemografie",
    primaryAgeGroups: "Hauptaltersgruppen",
    genderDistribution: "Geschlechterverteilung",
    competitionLevel: "Wettkampfniveau",
    additionalInfo: "Zusätzliche Informationen (Optional)",
    additionalInfoPlaceholder:
      "Erzählen Sie uns von den Erfolgen Ihres Vereins, dem gesellschaftlichen Engagement oder besonderen Eigenschaften, die Sponsoren interessieren könnten...",
    findSponsors: "Potenzielle Sponsoren finden",

    // Results
    sponsorRecommendations: "Sponsor-Empfehlungen für",
    demographicsAnalysis: "Demografische Analyse",
    recommendedIndustries: "Empfohlene Branchen",
    potentialSponsors: "Potenzielle Sponsoren",
    matchesFound: "Übereinstimmungen gefunden",

    // Sponsor Card
    whyTheyWouldSponsor: "Warum sie Sie sponsern würden:",
    website: "Website",
    email: "E-Mail",
    aiPitchMaterials: "KI-Präsentationsmaterialien",
    generatePitchMaterials: "Präsentationsmaterialien generieren",
    generatedIn: "Generiert in",
    regenerate: "Neu generieren",
    emailSubject: "E-Mail-Betreff",
    emailBody: "E-Mail-Text",
    partnershipSlogan: "Partnerschafts-Slogan",
    keyBenefits: "Hauptvorteile für Sponsor",
    collaborationIdeas: "Kooperationsideen",
    callToAction: "Handlungsaufforderung",

    // Demographics
    clubDemographicsOverview: "Vereinsdemografie-Übersicht",
    ageDistribution: "Altersverteilung",
    additionalClubInfo: "Zusätzliche Vereinsinformationen",

    // Footer
    footerText:
      "© 2024 AI Sponsor Finder. Sportvereine mit perfekten Sponsoren durch intelligentes Matching verbinden.",

    // Sports
    football: "Fußball",
    basketball: "Basketball",
    tennis: "Tennis",
    rugby: "Rugby",
    cricket: "Cricket",
    volleyball: "Volleyball",
    hockey: "Hockey",
    baseball: "Baseball",
    swimming: "Schwimmen",
    athletics: "Leichtathletik",
    other: "Andere",

    // Age Groups
    youth: "Jugend (6-17)",
    "young-adult": "Junge Erwachsene (18-25)",
    adult: "Erwachsene (26-40)",
    senior: "Senioren (40+)",
    mixed: "Gemischte Altersgruppen",

    // Gender
    "male-majority": "Überwiegend männlich (70%+)",
    "female-majority": "Überwiegend weiblich (70%+)",
    balanced: "Ausgewogen (40-60%)",

    // Competition Levels
    recreational: "Freizeit",
    amateur: "Amateur",
    "semi-professional": "Semi-professionell",
    professional: "Professionell",
  },
} as const

export function useTranslation(language: Language = "en") {
  return {
    t: (key: keyof typeof translations.en): string => {
      return translations[language][key] || translations.en[key] || key
    },
    language,
  }
}
