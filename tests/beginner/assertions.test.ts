import { expect, test } from "@playwright/test"

test("attributes", async ({ page }) => {
  await page.goto("https://play-playground.vercel.app/assertions")
  await page
    .getByRole("button", {
      name: "Shipped",
    })
    .click()
  await expect(page.getByTestId("order-status")).toHaveAttribute(
    "data-status",
    "Shipped",
  )
})

test("count", async ({ page }) => {
  await page.goto("https://play-playground.vercel.app/assertions")
  const initCount = await page.getByTestId("cart-item").count()
  await page.getByRole("button", { name: "Add item" }).click()
  const finalCount = await page.getByTestId("cart-item").count()
  expect.soft(finalCount).toBe(3)
  expect.soft(finalCount).toBeGreaterThan(initCount)
})

test.fail("count-2", async ({ page }) => {
  await page.goto("https://play-playground.vercel.app/assertions")

  const cartItem = page.getByTestId("cart-item")
  const initCount = await cartItem.count()

  await page.getByRole("button", { name: "Add item" }).click()

  const finalCount = cartItem.count()
  expect.soft(finalCount).toBeLessThan(initCount)
})
