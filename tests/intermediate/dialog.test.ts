import { expect, test } from "@playwright/test"

test.describe("Dialog and popup", () => {
  test.beforeEach("Navigation", async ({ page }) => {
    await page.goto("https://play-playground.vercel.app/dialogs")
  })

  test("alert", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      await expect(dialog.type()).toBe("alert")
      await expect(dialog.message()).toBe("🛒 Item added to cart!")
      await dialog.accept()
    })

    await page.getByRole("button", { name: "Trigger Alert" }).click()
    expect(page.getByText("✓ Alert accepted")).toBeVisible()
  })

  test("confirm", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      await expect(dialog.type()).toBe("confirm")
      await expect(dialog.message()).toBe(
        "Are you sure you want to delete this item?",
      )
      dialog.dismiss()
    })
    await page.getByRole("button", { name: "Delete Item" }).click()
    await expect(page.getByText("✓ Dismissed: Item kept")).toBeVisible()
  })

  test("Prompt", async ({ page }) => {
    page.once("dialog", async (dialog) => {
      await expect(dialog.type()).toBe("prompt")
      await expect(dialog.message()).toBe("Enter your promo code:")
      dialog.accept("PRE500")
    })
    await page.getByRole("button", { name: "Enter promo" }).click()
    await expect(page.getByText("Applied: PRE500")).toBeVisible()
  })

  test("Custom modal", async ({ page }) => {
    await page.getByRole("button", { name: "Review order" }).click()
    await expect(page.getByRole("heading", { name: "Review" })).toHaveText(
      "Review Your Order",
    )
    await page.getByRole("button", { name: "confirm" }).click()
    await expect(page.getByRole("heading", { name: "Review" })).toBeHidden()
  })

  test("Multiple tabs", async ({ page }) => {
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page
        .getByRole("link", {
          name: "terms & conditions",
        })
        .click(),
    ])
    await newPage.waitForLoadState()
    expect(
      newPage.getByRole("heading", {
        name: "Coming in Phase 2 / 3",
      }),
    ).toBeVisible()
  })
})
