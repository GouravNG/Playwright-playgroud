import { expect, test } from "@playwright/test"

test.describe("Finding locators", () => {
  test.beforeEach("Navigate to the base url", async ({ page, baseURL }) => {
    // Home page navigation
    await page.goto("/")
    await expect(page).toHaveURL(baseURL!)
    await expect(page).toHaveTitle("🎭 Playwright Practice Site")

    // locators page navigation
    await page.getByRole("heading", { name: "Locators Lab" }).click()
    await expect(page).toHaveURL("/locators")
    await expect(
      page.getByRole("heading", { name: "Locators Lab" }).first(),
    ).toBeVisible()
  })

  test("getByRole", async ({ page }) => {
    const roleCard = page.getByTestId("widget-get-by-role")
    await roleCard.getByRole("button", { name: "Add to cart" }).click()
    await expect(
      roleCard.getByRole("button", { name: "Buy now" }),
    ).toBeVisible()
    await expect(
      page.getByText("🛒 Wireless Headphones added to cart!"),
    ).toBeVisible()
  })

  test("getByText", async ({ page }) => {
    const textCard = page.getByTestId("widget-get-by-text")
    await expect(textCard.getByRole("heading")).toHaveText(
      "2. getByText — Product name labels",
    )
  })

  test("getByLabel", async ({ page }) => {
    const labelCard = page.getByTestId("widget-get-by-label")
    await labelCard.getByRole("spinbutton").fill("200")
    await expect(labelCard.getByLabel("Quantity")).toHaveValue("200")
  })

  test("getByPlaceholder", async ({ page }) => {
    const placeholderCard = page.getByTestId("widget-get-by-placeholder")
    await placeholderCard.getByPlaceholder("Search").fill("Apple iPhone")
    await expect(placeholderCard.getByPlaceholder("Search")).toHaveValue(
      "Apple iPhone",
    )
  })

  test("getByAltText", async ({ page }) => {
    const altCard = page.getByTestId("widget-get-by-alt-text")
    await expect(altCard.getByAltText("Headphone")).toBeVisible()
  })

  test("getByTitle", async ({ page }) => {
    const titleCard = page.getByTestId("widget-get-by-title")
    await expect(
      titleCard.getByTitle("Free Shipping on orders over $50"),
    ).toBeVisible()
  })

  test("Locators", async ({ page }) => {
    const locatorCard = page.getByTestId("widget-css-selector")
    await expect(
      locatorCard.locator('button[data-category="electronics"]'),
    ).toBeVisible()
  })

  test("xpath", async ({ page }) => {
    const xpathCard = page.getByTestId("widget-xpath-selector")
    await expect(
      xpathCard.locator("xpath=//*[button[text()='Checkout']]"),
    ).toBeVisible()
  })
})
