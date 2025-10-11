# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Mandatory Git Workflow - DO NOT SKIP
Before writing ANY code, you MUST:
1. Create a feature branch: `git checkout -b feature/[name]`
2. Commit changes FREQUENTLY (every file/component)
3. NEVER work on main branch directly
4. Add tests for feature and test thoroughly during development

## Project Overview

AI Sponsor Finder is a Next.js application that helps sports clubs find and connect with potential sponsors. It uses AI to analyze club demographics and generate personalized sponsor recommendations with ready-to-send pitch materials in multiple languages (English, French, German).

**Key Features:**
- AI-powered sponsor matching based on club demographics
- Multi-language support (en/fr/de) for all content and pitch materials
- **CSV/Excel file upload** - Upload member data files to automatically extract demographics
- Kanban-style tracking board for sponsor outreach pipeline
- AI-generated pitch materials (emails, slogans, collaboration ideas)
- User management with localStorage-based sessions

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Application Flow

1. **User Setup** (`/` page) → User creates account with name/email
2. **Club Form** (`/` page) → User enters club details (sport, location, demographics)
3. **Sponsor Results** (`/results` page) → AI generates sponsor recommendations
4. **Tracking Board** (`/tracking` page) → Kanban board to manage sponsor outreach

### Directory Structure

```
app/
├── api/
│   ├── generate-sponsors/route.ts    # Mock sponsor generation endpoint
│   └── generate-pitch/route.ts        # AI pitch generation using OpenAI GPT-4o-mini
├── layout.tsx                         # Root layout with theme provider
├── page.tsx                           # Home page with user setup + club form
├── results/page.tsx                   # Sponsor recommendations display
└── tracking/page.tsx                  # Kanban board for tracking sponsors

components/
├── ui/                                # shadcn/ui components (Button, Card, etc.)
├── club-info-form.tsx                 # Main form for club data entry
├── sponsor-card.tsx                   # Individual sponsor card with tracking
├── demographics-chart.tsx             # Visual chart of club demographics
├── language-selector.tsx              # Language switcher component
├── user-setup.tsx                     # Initial user registration flow
└── theme-provider.tsx                 # next-themes dark/light mode

lib/
├── api.ts                             # Client-side API functions
├── types.ts                           # TypeScript type definitions
├── user-storage.ts                    # LocalStorage management for users/sessions
├── i18n.ts                            # Translation system for 3 languages
└── utils.ts                           # Utility functions (cn helper)
```

### State Management

**LocalStorage-based** - No external state management library:

- `ai-sponsor-user` - Current user data (id, name, email, createdAt)
- `ai-sponsor-session` - Current session (userId, clubData)
- `trackedSponsors_{userId}` - Per-user tracked sponsors list

All state is managed via `UserStorage` class (`lib/user-storage.ts`).

### API Routes

**`/api/generate-sponsors` (POST)**
- Input: `ClubData` object
- Output: `SponsorsResponse` with mock sponsors array, demographics analysis, recommended industries
- Currently returns mock data (not using AI)

**`/api/generate-pitch` (POST)**
- Input: `{ clubData, sponsor, language }`
- Output: `PitchContent` with emailSubject, emailBody, slogan, collaborationIdeas, keyBenefits, callToAction
- Uses OpenAI `gpt-4o-mini` via AI SDK's `generateObject` with Zod schema validation
- Requires `OPENAI_API_KEY` environment variable
- **Enhanced:** Now includes API key validation and detailed error messages

**`/api/upload-members` (POST)** - NEW
- Input: FormData with file (CSV or Excel)
- Output: `FileUploadResponse` with parsed member data and preview
- Accepts .csv, .xlsx, .xls files (max 5MB)
- Parses demographics: age distribution, gender split, total members
- Returns structured data for auto-filling form fields
- Uses `papaparse` for CSV and `xlsx` for Excel parsing

**`/api/health` (GET)** - NEW
- Health check endpoint to validate API configuration
- Returns OpenAI API key status (configured/not configured) without exposing the key
- Useful for debugging deployment issues

### Type System

Core types in `lib/types.ts`:

- `ClubData` - Club information from form
- `Sponsor` - Basic sponsor information
- `SponsorsResponse` - API response with sponsors + analysis
- `TrackedSponsor` - Sponsor + tracking status (extends Sponsor)
- `SponsorStatus` - "Not Contacted" | "Contacted" | "In Discussion" | "Rejected" | "Approved"
- `PitchContent` - AI-generated pitch materials
- `Language` - "en" | "fr" | "de"

### Internationalization (i18n)

- Translation keys defined in `lib/i18n.ts` for all 3 languages
- `useTranslation(language)` hook returns `t` function for translation
- Language selector in navigation persists via component state
- AI-generated content uses `language` parameter in API calls

## Important Implementation Notes

### V0 Integration
This project was initialized and is synced with v0.app. Changes deployed on v0.app are automatically pushed to this repository. The repository stays in sync with deployed chats on v0.app.

### Build Configuration
- ESLint errors ignored during builds (`ignoreDuringBuilds: true`)
- TypeScript errors ignored during builds (`ignoreBuildErrors: true`)
- Images are unoptimized (`unoptimized: true`)

### Responsive Design
- Desktop: Kanban board with drag-and-drop for tracking page
- Mobile/Tablet: Dropdown-based status management with filter tabs
- Uses Tailwind breakpoints (`lg:` prefix for desktop-specific styles)

### AI Integration
- Uses Vercel AI SDK (`ai` package) with OpenAI provider
- Model: `gpt-4o-mini` for cost-effective pitch generation
- Structured output via `generateObject` with Zod schemas
- Temperature and other parameters can be tuned in route handlers

### Styling
- Tailwind CSS v4 with PostCSS
- shadcn/ui components (Radix UI primitives)
- `class-variance-authority` for component variants
- Custom CSS utilities: `tailwindcss-animate`, `tw-animate-css`
- Path alias: `@/*` maps to project root

## Common Development Tasks

### Adding a New Language
1. Add language code to `Language` type in `lib/types.ts`
2. Add translations object in `lib/i18n.ts` following existing structure
3. Update `languagePrompts` object in `/api/generate-pitch/route.ts`
4. Update language selector options in `components/language-selector.tsx`

### Modifying Sponsor Generation
Currently using mock data in `/api/generate-sponsors/route.ts`. To integrate real AI:
1. Import OpenAI SDK and create schema in route handler
2. Use `generateObject` similar to `/api/generate-pitch/route.ts`
3. Update prompt to analyze club demographics and suggest real sponsors
4. Consider using web search or vector database for actual sponsor data

### Adding Tracking Status
1. Update `SponsorStatus` type in `lib/types.ts`
2. Add to `statusColumns` array in `/tracking/page.tsx`
3. Update `getStatusColor` and `getStatusIcon` functions
4. Columns will automatically appear in kanban board

### Debugging LocalStorage Issues
Use browser DevTools → Application → Local Storage to inspect:
- `ai-sponsor-user` - Check user is created properly
- `ai-sponsor-session` - Verify clubData is saved
- `trackedSponsors_{userId}` - Validate sponsor tracking state

Clear data: `UserStorage.clearUserData()` in console or manually delete keys.

## CSV/Excel Upload Feature

The application now supports uploading member data files to automatically extract demographics:

### Supported File Formats:
- CSV (.csv)
- Excel (.xlsx, .xls)
- Maximum file size: 5MB

### Expected File Structure:
Files should contain columns with member information. The parser supports flexible column names:
- **Age data**: `age`, `Age`, `AGE`, `date_of_birth`, `dateOfBirth`, `dob`, `DOB`, `birthdate`
- **Gender data**: `gender`, `Gender`, `GENDER`, `sex`, `Sex`

### How It Works:
1. User clicks "Choose File" in the form
2. File is uploaded to `/api/upload-members`
3. Server parses the file using `papaparse` (CSV) or `xlsx` (Excel)
4. Demographics are extracted using `lib/member-data-parser.ts`:
   - Age distribution calculated and categorized (youth, young adult, adult, senior)
   - Gender distribution calculated (male, female, other)
   - Dominant age group and gender determined
5. Form fields auto-populate with parsed data
6. User can manually adjust any auto-filled values
7. Submit form as normal

### Parser Logic (`lib/member-data-parser.ts`):
- Flexible column name matching (case-insensitive, handles underscores/spaces)
- Age calculated from DOB if age column not present
- Ages categorized: Youth (6-17), Young Adult (18-25), Adult (26-40), Senior (40+)
- Gender normalized: male/female/other
- Percentages calculated for all distributions

## Known Issues / Technical Debt

1. ~~**API Mismatch**~~: FIXED - API route corrected from `/api/generate-pitch-materials` to `/api/generate-pitch`

2. **Mock Data**: `/api/generate-sponsors` returns hardcoded sponsors instead of AI-generated recommendations.

3. **No Backend**: All data stored in localStorage - users lose data if they clear browser storage or switch devices.

4. ~~**OpenAI API Key**~~: FIXED - Now includes validation, error handling, and health check endpoint

5. **Duplicate Detection**: Sponsors are deduplicated by name (case-insensitive) but different sponsors could have the same name.

## Environment Variables

Required:
- `OPENAI_API_KEY` - OpenAI API key for pitch generation

## Deployment

Project is deployed on Vercel and automatically synced with v0.app:
- Live URL: https://vercel.com/weihsuanlees-projects/v0-ai-sponsor-finder
- V0 Project: https://v0.app/chat/projects/8JeRrcgC6Ed
