import { expect, test } from "@playwright/test"

test.describe("Frames", () => {
  test.beforeEach("Navigation", async ({ page }) => {
    await page.goto("/frames")
  })

  test("iFrame handling", async ({ page }) => {
    const paymentFrame = page.frameLocator("#payment-frame")
    await test.step("Enter Card number", async () => {
      await paymentFrame.getByLabel("Card Number").fill("4242_4242_4242_4242")
      await paymentFrame.getByLabel("Expires").fill("12/28")
      await paymentFrame.getByLabel("CVV").fill("123")

      await paymentFrame.getByRole("button", { name: "Authorize" }).click()
      await expect(
        paymentFrame.getByText("Payment Processed in Frame!"),
      ).toBeVisible()
    })
  })

  test("Shadow root", async ({ page }) => {
    await page.getByRole("button", { name: "click" }).click()
    await expect(page.getByText("✓ Shadow Button Clicked!")).toBeVisible()
  })
})
