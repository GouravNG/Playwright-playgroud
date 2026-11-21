import { expect, Locator, test } from "@playwright/test"

test.describe("Playwright actions", () => {
  let eventLogCard: Locator

  test.beforeEach("Navigate to the base url", async ({ page, baseURL }) => {
    // Home page navigation
    await page.goto("/")
    await expect(page).toHaveURL(baseURL!)
    await expect(page).toHaveTitle("🎭 Playwright Practice Site")

    // locators page navigation
    await page.getByRole("heading", { name: "Actions Arena" }).click()
    await expect(page).toHaveURL("/actions")
    await expect(
      page.getByRole("heading", { name: "Actions Arena" }).first(),
    ).toBeVisible()

    eventLogCard = page.getByTestId("event-log")
  })

  test("double click", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Double-click",
      })
      .dblclick()

    await expect(
      eventLogCard.getByText("dblclick() → Quick Edit triggered"),
    ).toBeVisible()
    await expect(eventLogCard).toContainText(
      "dblclick() → Quick Edit triggered",
    )
  })

  test("right click", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Right-click me",
      })
      .click({ button: "right" })
    await expect(eventLogCard).toContainText(
      "right-click → context menu triggered",
    )
  })

  test("hover", async ({ page }) => {
    await page.getByTestId("product-hover-target").hover()
    const widgetCard = page.getByTestId("widget-hover")
    await expect(
      widgetCard.getByRole("button", { name: "Add to Cart" }),
    ).toBeVisible()
    await expect(eventLogCard).toContainText(
      "hover() → Quick View panel revealed",
    )
  })

  test("custom click", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Open Product",
      })
      .click({ modifiers: ["Control"] })
    await expect(eventLogCard).toContainText(
      "Ctrl+click() → opens in new tab (simulated)",
    )
  })

  test("Scroll to view", async ({ page }) => {
    const card = page.getByRole("heading", {
      name: "8. keyboard.type() — Type text",
    })
    await expect(card).not.toBeInViewport()
    await card.scrollIntoViewIfNeeded()
    await expect(card).toBeInViewport()
  })

  test("Focus and blur", async ({ page }) => {
    const input = page.getByPlaceholder("Email Address")
    await input.focus()
    await expect(input).toBeFocused()
    await input.blur()
    await expect(input).not.toBeFocused()
  })

  test("Entering something", async ({ page }) => {
    // keyboard shortcuts
    await page.getByPlaceholder("Focus").focus()
    await page.keyboard.press("Control+k") //same time keypress
    await expect(eventLogCard).toContainText(
      "keyboard.press('Control+K') → Search opened",
    )

    // typing
    await page.getByPlaceholder("Promo").pressSequentially("PREBOOK30") //each key press with minute delay 80ms
    await page.getByRole("button", { name: "Apply" }).click()
    await expect(eventLogCard).toContainText(
      "pressSequentially() → typed 'PREBOOK30'",
    )
  })
})
