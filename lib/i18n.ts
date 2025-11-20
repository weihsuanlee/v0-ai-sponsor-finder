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
    backToResults: "Back to Results",
    goToTracking: "Go to Tracking",
    viewSponsorRecommendations: "View Sponsor Recommendations",
    companyDetails: "Company Details",
    contactInformation: "Contact Information",
    industryLabel: "Industry",

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
    noClubDataError: "No club data found. Please fill out the form first.",
    sponsorGenerationError: "Failed to generate sponsor recommendations. Please try again.",

    // Tracking
    trackingTitle: "Sponsor Tracking Board",
    trackingSubtitleDesktop: "Drag and drop sponsors to update their status",
    trackingSubtitleMobile: "Manage your sponsor outreach pipeline",
    trackingEmptyTitle: "No Sponsors Tracked Yet",
    trackingEmptyDescription: "Start by adding sponsors from your results page to track your outreach progress.",
    filterAll: "All",
    trackingFilterShowing: "Showing",
    trackingFilterSponsorsWithStatus: "sponsors with status",
    statusNotContacted: "Not Contacted",
    statusContacted: "Contacted",
    statusInDiscussion: "In Discussion",
    statusRejected: "Rejected",
    statusApproved: "Approved",
    statusLabel: "Status:",

    // Agent
    agentButton: "Smart Sponsor Evaluator",
    agentDialogTitle: "Smart Sponsor Evaluator",
    agentDialogDescription:
      "Research a potential sponsor, evaluate fit, and send the result to your tracking list when ready.",
    agentInputPlaceholder: "Company or brand name",
    agentAnalyze: "Analyze",
    agentRunning: "Running",
    agentProvideCompanyError: "Provide a company or brand name to analyze.",
    agentWorkflowTitle: "Agent Workflow",
    agentWorkflowEmpty: "Submit a company name to watch the agent progress through each step.",
    agentWorkflowWorking: "Agent is working…",
    agentWorkflowWorkingDetail: "Gathering additional context",
    agentRecommendationHeader: "Evaluator Recommendation",
    agentFitScoreLabel: "Fit Score",
    agentSuggestedTypeLabel: "Suggested sponsorship type",
    agentFitReasonsLabel: "Fit reasons",
    agentPitchInstructions: "Use the sponsor card below to generate pitch materials when you're ready.",
    agentAddToTracking: "Add to Tracking",
    agentTrackingAdded: "Added to tracking",
    agentTrackingExists: "Sponsor already tracked",
    agentFullSponsorCard: "Full Sponsor Card",
    agentLogReasoning: "🧠 Starting agent reasoning…",
    agentLogSearch: "🔍 Searching business info…",
    agentLogProfile: "📑 Extracting business profile…",
    agentLogFit: "📊 Evaluating sponsor fit…",
    agentLogSummary: "🧠 Finalizing agent summary…",
    agentLogFailurePrefix: "⚠️ Agent failed",
    agentLogThinking: "🤖 Thinking… deciding next step",
    agentLogControllerDecision: "Controller selected: {action}",
    agentActionSearch: "searchBusinessInfo",
    agentActionProfile: "extractBusinessProfile",
    agentActionFit: "scoreSponsorFit",
    agentActionDone: "done",
    agentFinalSummary: "{business} scored {score}/100 with a recommended sponsorship type of {type}.",
    agentErrorGeneric: "Unable to analyze this company right now.",

    // Sponsor Card
    whyTheyWouldSponsor: "Why they'd sponsor you:",
    targetAudienceLabel: "Target Audience",
    campaignIdeas: "Campaign Ideas",
    exampleCampaignIdea: "Example Campaign Idea",
    website: "Website",
    email: "Email",
    contact: "Contact",
    visitWebsite: "Visit Website",
    sendEmail: "Send Email",
    callNow: "Call Now",
    aiPitchMaterials: "AI Pitch Materials",
    generatePitchMaterials: "Generate Pitch Materials",
    generatePitch: "Generate Pitch",
    generatedIn: "Generated in",
    regenerate: "Regenerate",
    generating: "Generating...",
    emailSubject: "Email Subject",
    emailBody: "Email Body",
    pitchEmail: "Pitch Email",
    partnershipSlogan: "Partnership Slogan",
    keyBenefits: "Key Benefits for Sponsor",
    keyTalkingPoints: "Key Talking Points",
    collaborationIdeas: "Collaboration Ideas",
    callToAction: "Call to Action",
    viewDetails: "View Details",
    viewDetailsAndGenerate: "View Details & Generate Pitch",
    alreadyTracked: "Already added to tracking",
    addToTracking: "Add to tracking",
    addedToTracking: "Added",
    campaignIdeaTechnology: "Tech Innovation Showcase - Feature your products at our tech-savvy events",
    campaignIdeaFood: "Game Day Fuel Partnership - Provide refreshments for players and fans",
    campaignIdeaAutomotive: "Victory Lap Sponsorship - Brand vehicles at championship celebrations",
    campaignIdeaHealthcare: "Wellness Champions Program - Promote health and fitness initiatives",
    campaignIdeaFinance: "Financial Fitness Campaign - Educate athletes on financial planning",
    campaignIdeaRetail: "Fan Gear Collaboration - Co-branded merchandise and exclusive discounts",
    campaignIdeaSports: "Performance Partnership - Provide equipment and training gear",
    campaignIdeaEducation: "Scholar Athlete Program - Support academic excellence initiatives",
    campaignIdeaDefault: "Custom Partnership Campaign - Tailored collaboration opportunities",

    // Demographics
    clubDemographicsOverview: "Club Demographics Overview",
    ageDistribution: "Age Distribution",
    additionalClubInfo: "Additional Club Information",
    competitionLevelLabel: "Level",
    male: "Male",
    female: "Female",
    other: "Other",

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
    backToResults: "Retour aux résultats",
    goToTracking: "Aller au suivi",
    viewSponsorRecommendations: "Voir les recommandations de sponsors",
    companyDetails: "Informations sur l'entreprise",
    contactInformation: "Informations de contact",
    industryLabel: "Industrie",

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
    noClubDataError: "Aucune donnée de club trouvée. Veuillez d'abord remplir le formulaire.",
    sponsorGenerationError: "Impossible de générer des recommandations de sponsors. Veuillez réessayer.",

    // Tracking
    trackingTitle: "Tableau de suivi des sponsors",
    trackingSubtitleDesktop: "Glissez-déposez les sponsors pour mettre à jour leur statut",
    trackingSubtitleMobile: "Gérez votre pipeline de prospection sponsors",
    trackingEmptyTitle: "Aucun sponsor suivi pour le moment",
    trackingEmptyDescription: "Ajoutez des sponsors depuis la page de résultats pour suivre votre progression.",
    filterAll: "Tous",
    trackingFilterShowing: "Affichage de",
    trackingFilterSponsorsWithStatus: "sponsors avec le statut",
    statusNotContacted: "Pas contacté",
    statusContacted: "Contacté",
    statusInDiscussion: "En discussion",
    statusRejected: "Refusé",
    statusApproved: "Approuvé",
    statusLabel: "Statut :",

    // Agent
    agentButton: "Évaluateur de sponsors intelligent",
    agentDialogTitle: "Évaluateur de sponsors intelligent",
    agentDialogDescription:
      "Analysez un partenaire potentiel, évaluez l'adéquation et ajoutez le résultat à votre tableau de suivi.",
    agentInputPlaceholder: "Nom d'entreprise ou de marque",
    agentAnalyze: "Analyser",
    agentRunning: "Analyse en cours",
    agentProvideCompanyError: "Indiquez une entreprise ou une marque à analyser.",
    agentWorkflowTitle: "Flux de travail de l'agent",
    agentWorkflowEmpty: "Envoyez un nom d'entreprise pour suivre chaque étape de l'agent.",
    agentWorkflowWorking: "L'agent travaille…",
    agentWorkflowWorkingDetail: "Collecte d'informations supplémentaires",
    agentRecommendationHeader: "Recommandation de l'évaluateur",
    agentFitScoreLabel: "Score d'adéquation",
    agentSuggestedTypeLabel: "Type de sponsoring suggéré",
    agentFitReasonsLabel: "Raisons de l'adéquation",
    agentPitchInstructions: "Utilisez la fiche sponsor ci-dessous pour générer les supports lorsque vous êtes prêt.",
    agentAddToTracking: "Ajouter au suivi",
    agentTrackingAdded: "Ajouté au suivi",
    agentTrackingExists: "Sponsor déjà suivi",
    agentFullSponsorCard: "Fiche sponsor complète",
    agentLogReasoning: "🧠 Démarrage du raisonnement de l'agent…",
    agentLogSearch: "🔍 Recherche d'informations sur l'entreprise…",
    agentLogProfile: "📑 Extraction du profil de l'entreprise…",
    agentLogFit: "📊 Évaluation de l'adéquation…",
    agentLogSummary: "🧠 Finalisation du résumé…",
    agentLogFailurePrefix: "⚠️ L'agent a échoué",
    agentLogThinking: "🤖 Réflexion… décision de l'étape suivante",
    agentLogControllerDecision: "Contrôleur sélectionné : {action}",
    agentActionSearch: "searchBusinessInfo",
    agentActionProfile: "extractBusinessProfile",
    agentActionFit: "scoreSponsorFit",
    agentActionDone: "done",
    agentFinalSummary: "{business} obtient {score}/100 avec un type de partenariat recommandé {type}.",
    agentErrorGeneric: "Impossible d'analyser cette entreprise pour le moment.",

    // Sponsor Card
    whyTheyWouldSponsor: "Pourquoi ils vous sponsoriseraient :",
    targetAudienceLabel: "Public cible",
    campaignIdeas: "Idées de campagne",
    exampleCampaignIdea: "Exemple d'idée de campagne",
    website: "Site web",
    email: "Email",
    contact: "Contact",
    visitWebsite: "Visiter le site web",
    sendEmail: "Envoyer un email",
    callNow: "Appeler maintenant",
    aiPitchMaterials: "Supports de présentation IA",
    generatePitchMaterials: "Générer les supports de présentation",
    generatePitch: "Générer un pitch",
    generatedIn: "Généré en",
    regenerate: "Régénérer",
    generating: "Génération...",
    emailSubject: "Objet de l'email",
    emailBody: "Corps de l'email",
    pitchEmail: "Email de pitch",
    partnershipSlogan: "Slogan du partenariat",
    keyBenefits: "Avantages clés pour le sponsor",
    keyTalkingPoints: "Points clés",
    collaborationIdeas: "Idées de collaboration",
    callToAction: "Appel à l'action",
    viewDetails: "Voir les détails",
    viewDetailsAndGenerate: "Voir les détails et générer un pitch",
    alreadyTracked: "Déjà ajouté au suivi",
    addToTracking: "Ajouter au suivi",
    addedToTracking: "Ajouté",
    campaignIdeaTechnology:
      "Vitrine d'innovation technologique - Mettez vos produits en avant lors de nos événements orientés tech",
    campaignIdeaFood: "Partenariat énergie jour de match - Fournissez des rafraîchissements aux joueurs et supporters",
    campaignIdeaAutomotive: "Sponsoring tour d'honneur - Brandissez des véhicules lors des célébrations",
    campaignIdeaHealthcare: "Programme champions du bien-être - Promouvez la santé et le fitness",
    campaignIdeaFinance: "Campagne forme financière - Sensibilisez les athlètes à la gestion financière",
    campaignIdeaRetail: "Collaboration merchandising fans - Produits co-marqués et remises exclusives",
    campaignIdeaSports: "Partenariat performance - Fournissez équipements et matériel d'entraînement",
    campaignIdeaEducation: "Programme athlète-étudiant - Soutenez les initiatives académiques",
    campaignIdeaDefault: "Campagne de partenariat sur mesure - Opportunités de collaboration personnalisées",

    // Demographics
    clubDemographicsOverview: "Aperçu démographique du club",
    ageDistribution: "Répartition par âge",
    additionalClubInfo: "Informations supplémentaires sur le club",
    competitionLevelLabel: "Niveau",
    male: "Hommes",
    female: "Femmes",
    other: "Autres",

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
    backToResults: "Zurück zu den Ergebnissen",
    goToTracking: "Zur Nachverfolgung",
    viewSponsorRecommendations: "Sponsor-Empfehlungen anzeigen",
    companyDetails: "Unternehmensdetails",
    contactInformation: "Kontaktinformationen",
    industryLabel: "Branche",

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
    noClubDataError: "Keine Clubdaten gefunden. Bitte füllen Sie zuerst das Formular aus.",
    sponsorGenerationError: "Sponsor-Empfehlungen konnten nicht erstellt werden. Bitte erneut versuchen.",

    // Tracking
    trackingTitle: "Sponsor-Tracking-Board",
    trackingSubtitleDesktop: "Ziehen Sie Sponsoren per Drag & Drop, um ihren Status zu aktualisieren",
    trackingSubtitleMobile: "Verwalten Sie Ihre Sponsoren-Pipeline",
    trackingEmptyTitle: "Noch keine Sponsoren verfolgt",
    trackingEmptyDescription: "Fügen Sie Sponsoren von der Ergebnisseite hinzu, um Ihren Fortschritt zu verfolgen.",
    filterAll: "Alle",
    trackingFilterShowing: "Angezeigt",
    trackingFilterSponsorsWithStatus: "Sponsoren mit Status",
    statusNotContacted: "Nicht kontaktiert",
    statusContacted: "Kontaktiert",
    statusInDiscussion: "In Gespräch",
    statusRejected: "Abgelehnt",
    statusApproved: "Genehmigt",
    statusLabel: "Status:",

    // Agent
    agentButton: "Intelligenter Sponsor-Bewerter",
    agentDialogTitle: "Intelligenter Sponsor-Bewerter",
    agentDialogDescription:
      "Recherchiere ein mögliches Unternehmen, bewerte die Eignung und füge das Ergebnis deinem Tracking hinzu.",
    agentInputPlaceholder: "Unternehmens- oder Markenname",
    agentAnalyze: "Analysieren",
    agentRunning: "Analyse läuft",
    agentProvideCompanyError: "Bitte gib ein Unternehmen oder eine Marke zur Analyse ein.",
    agentWorkflowTitle: "Agenten-Workflow",
    agentWorkflowEmpty: "Sende einen Unternehmensnamen, um jeden Schritt des Agenten zu verfolgen.",
    agentWorkflowWorking: "Der Agent arbeitet…",
    agentWorkflowWorkingDetail: "Weitere Kontextinformationen werden gesammelt",
    agentRecommendationHeader: "Empfehlung des Bewerters",
    agentFitScoreLabel: "Fit-Score",
    agentSuggestedTypeLabel: "Vorgeschlagene Sponsoring-Art",
    agentFitReasonsLabel: "Gründe für die Eignung",
    agentPitchInstructions: "Nutze die Sponsor-Karte unten, um später Pitch-Materialien zu erzeugen.",
    agentAddToTracking: "Zum Tracking hinzufügen",
    agentTrackingAdded: "Zum Tracking hinzugefügt",
    agentTrackingExists: "Sponsor bereits im Tracking",
    agentFullSponsorCard: "Komplette Sponsor-Karte",
    agentLogReasoning: "🧠 Agenten-Überlegung gestartet…",
    agentLogSearch: "🔍 Suche nach Unternehmensinfos…",
    agentLogProfile: "📑 Unternehmensprofil wird extrahiert…",
    agentLogFit: "📊 Sponsoren-Fit wird bewertet…",
    agentLogSummary: "🧠 Zusammenfassung wird erstellt…",
    agentLogFailurePrefix: "⚠️ Agent fehlgeschlagen",
    agentLogThinking: "🤖 Denke nach… wähle nächsten Schritt",
    agentLogControllerDecision: "Controller hat ausgewählt: {action}",
    agentActionSearch: "searchBusinessInfo",
    agentActionProfile: "extractBusinessProfile",
    agentActionFit: "scoreSponsorFit",
    agentActionDone: "done",
    agentFinalSummary: "{business} erzielte {score}/100 mit dem empfohlenen Sponsoring-Typ {type}.",
    agentErrorGeneric: "Diese Firma kann derzeit nicht analysiert werden.",

    // Sponsor Card
    whyTheyWouldSponsor: "Warum sie Sie sponsern würden:",
    targetAudienceLabel: "Zielgruppe",
    campaignIdeas: "Kampagnenideen",
    exampleCampaignIdea: "Beispielhafte Kampagnenidee",
    website: "Website",
    email: "E-Mail",
    contact: "Kontakt",
    visitWebsite: "Website besuchen",
    sendEmail: "E-Mail senden",
    callNow: "Jetzt anrufen",
    aiPitchMaterials: "KI-Präsentationsmaterialien",
    generatePitchMaterials: "Präsentationsmaterialien generieren",
    generatePitch: "Pitch generieren",
    generatedIn: "Generiert in",
    regenerate: "Neu generieren",
    generating: "Wird erstellt...",
    emailSubject: "E-Mail-Betreff",
    emailBody: "E-Mail-Text",
    pitchEmail: "Pitch-E-Mail",
    partnershipSlogan: "Partnerschafts-Slogan",
    keyBenefits: "Hauptvorteile für Sponsor",
    keyTalkingPoints: "Wesentliche Gesprächspunkte",
    collaborationIdeas: "Kooperationsideen",
    callToAction: "Handlungsaufforderung",
    viewDetails: "Details anzeigen",
    viewDetailsAndGenerate: "Details anzeigen & Pitch generieren",
    alreadyTracked: "Bereits im Tracking",
    addToTracking: "Zum Tracking hinzufügen",
    addedToTracking: "Hinzugefügt",
    campaignIdeaTechnology:
      "Tech-Innovationsshowcase – Präsentieren Sie Ihre Produkte bei unseren technikaffinen Events",
    campaignIdeaFood: "Matchday-Fuel-Partnerschaft – Versorgen Sie Spieler und Fans mit Verpflegung",
    campaignIdeaAutomotive: "Victory-Lap-Sponsoring – Fahrzeugbranding bei Siegesfeiern",
    campaignIdeaHealthcare: "Wellness-Champions-Programm – Gesundheits- und Fitnessinitiativen unterstützen",
    campaignIdeaFinance: "Financial-Fitness-Kampagne – Athleten in Finanzplanung schulen",
    campaignIdeaRetail: "Fanwear-Kollaboration – Co-Branding von Merchandise und exklusive Rabatte",
    campaignIdeaSports: "Performance-Partnerschaft – Ausrüstung und Trainingsmaterial bereitstellen",
    campaignIdeaEducation: "Scholar-Athlete-Programm – Akademische Initiativen fördern",
    campaignIdeaDefault: "Individuelle Partnerschaftskampagne – Maßgeschneiderte Kooperationsmöglichkeiten",

    // Demographics
    clubDemographicsOverview: "Vereinsdemografie-Übersicht",
    ageDistribution: "Altersverteilung",
    additionalClubInfo: "Zusätzliche Vereinsinformationen",
    competitionLevelLabel: "Niveau",
    male: "Männer",
    female: "Frauen",
    other: "Andere",

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

export type TranslationKey = keyof typeof translations.en

export function useTranslation(language: Language = "en") {
  return {
    t: (key: TranslationKey): string => {
      return translations[language][key] || translations.en[key] || key
    },
    language,
  }
}
