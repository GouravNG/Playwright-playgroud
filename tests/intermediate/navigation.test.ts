import { expect, test } from "@playwright/test"

test.describe("Navigtion and routing", () => {
  test.beforeEach("Navigation", async ({ page }) => {
    await page.goto("/navigation")
  })

  test("basic navigtion", async ({ page }) => {
    await page
      .getByRole("link", {
        name: "Browse product",
      })
      .click()
    await expect(page).toHaveURL("/navigation/products")
    await page.goBack()
    await expect(page).toHaveURL("/navigation")
    await page.goForward()
    await expect(page).toHaveURL("/navigation/products")
    await page.reload()
    await expect(page).toHaveURL("/navigation/products")
  })

  test("Slow navigation", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "checkout",
      })
      .click()
    await page.waitForURL("/navigation/checkout", { timeout: 5000 })
    await expect(page).toHaveURL("/navigation/checkout", { timeout: 5000 })
    await expect(page.getByRole("heading", { name: "checkout" })).toHaveText(
      "Checkout Terminal",
    )
  })

  test("#links", async ({ page }) => {
    await page.getByRole("link", { name: "#faq" }).click()
    await expect(page).toHaveURL(/#faq/)
  })

  test("handling 404", async ({ page }) => {
    const response = await page.goto("/random404")
    expect(response?.status()).toBe(404)
  })
})
