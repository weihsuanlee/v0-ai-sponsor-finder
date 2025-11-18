import { test, expect } from "@playwright/test"

const mockUser = {
  id: "user_test",
  name: "Playwright User",
  email: "qa@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
}

const mockSession = {
  userId: mockUser.id,
  createdAt: "2024-01-01T00:00:00.000Z",
  clubData: {
    clubName: "QA FC",
    sportType: "football",
    location: "Luxembourg",
    totalMembers: 20,
    ageGroups: "mixed",
    genderSplit: "balanced",
    competitionLevel: "amateur",
    additionalInfo: "Playwright seed data",
  },
}

test("home page renders hero CTA and theme toggle", async ({ page }) => {
  // Set up localStorage BEFORE navigating to the page
  await page.goto("/")
  await page.evaluate(
    ({ user, session }) => {
      localStorage.setItem("ai-sponsor-user", JSON.stringify(user))
      localStorage.setItem("ai-sponsor-session", JSON.stringify(session))
    },
    { user: mockUser, session: mockSession },
  )

  // Navigate to the page with user already set
  await page.goto("/")
  await page.waitForLoadState("networkidle")

  // Wait for the loading spinner to disappear (if present)
  await page.waitForSelector(".animate-spin", { state: "hidden", timeout: 5000 }).catch(() => {
    // Spinner might not appear if page loads quickly
  })

  // Check for the hero heading - use a more flexible selector
  await expect(page.locator("h1").filter({ hasText: /Connect Your Sports Club/i })).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole("button", { name: /Get Started/i })).toBeVisible()

  // Find the theme toggle button using its aria-label
  const toggle = page.getByRole("button", { name: /Activate dark mode/i })
  await expect(toggle).toBeVisible()

  // Scroll to the top to ensure the button is not covered on mobile
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(100)

  // Click the toggle (use force on mobile if needed)
  await toggle.click({ force: true })

  // Wait for theme to change and check that dark mode was applied
  await page.waitForTimeout(200)
  await expect(page.locator("html")).toHaveClass(/dark/)
})
