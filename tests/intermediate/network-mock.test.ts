/**
Method	What happens
fulfill()	You respond with a mock. Done.
abort()	Request is cancelled. Done.
continue()	Sends the request to the network, skipping all other handlers.
fallback()	Passes to the next route handler (then network if none left).
 */

import { expect, test } from "@playwright/test"

test.describe("Network mocking", () => {
  test.beforeEach("Navigate to the site", async ({ page }) => {
    await page.goto("https://play-playground.vercel.app/network")
  })

  test("mock GetCall", async ({ page }) => {
    await page.route("/api/products", async (route) => {
      await route.fulfill({
        body: JSON.stringify({
          timestamp: "2026-11-22T11:05:09.145Z",
          source: "local-mock-source",
          data: [
            {
              id: 1,
              name: "Wireless Headphones",
              price: -79.99,
              category: "Electronics",
              rating: 14.5,
              inStock: true,
            },
          ],
        }),
      })
    })
    await page.getByRole("button", { name: "Execute" }).click()
    await expect(page.getByText("local-mock-source")).toBeVisible()
  })

  test("simulate network error |500", async ({ page }) => {
    await page.route("/api/products", async (route) => {
      await route.abort("failed")
    })
    await page.getByRole("button", { name: "Execute" }).click()
  })

  test("intercept header", async ({ page }) => {
    await page.route("/api/transactions", async (route) => {
      const headers = await route.request().headers()
      route.request()
      headers["Authorization"] = ""
      await route.continue({ headers })
    })
    await page.getByRole("button", { name: "send with bearer" }).click()
    await expect(
      page.getByText("⚠️ HTTP 401: Unauthorized: Missing Authorization header"),
    ).toBeVisible()
  })
})
