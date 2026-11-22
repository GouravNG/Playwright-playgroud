import { test, expect } from "@playwright/test"

test.describe("Fill the form", () => {
  test.beforeEach("Navigate to the base url", async ({ page, baseURL }) => {
    // Home page navigation
    await page.goto("/")
    await expect(page).toHaveURL(baseURL!)
    await expect(page).toHaveTitle("🎭 Playwright Practice Site")

    // locators page navigation
    await page.getByRole("heading", { name: "Forms & Inputs" }).click()
    await expect(page).toHaveURL("/forms")
    await expect(
      page.getByRole("heading", { name: "Forms & Inputs" }).first(),
    ).toBeVisible()
  })

  test("Fill and validate the form submission", async ({ page }) => {
    await test.step("Fill personal details", async () => {
      const fullName = page.getByLabel("Full name")
      const email = page.getByLabel("Email")
      const phone = page.getByLabel("phone")
      const password = page.getByLabel("password")
      const gender = page.getByLabel("Male", { exact: true })
      const dob = page.getByLabel("Date of Birth")

      await fullName.fill("Gourav")
      await expect(fullName).toHaveValue("Gourav")

      await email.fill("gourav@yopmail.com")
      await expect(email).toHaveValue("gourav@yopmail.com")

      await phone.fill("+919999999999")
      await expect(phone).toHaveValue("+919999999999")

      await password.fill("Hello@123")
      await expect(password).toHaveValue("Hello@123")

      await gender.check()
      await expect(gender).toBeChecked()

      await dob.fill("2000-07-18")
      await expect(dob).toHaveValue("2000-07-18")
    })
    await test.step("Fill delivery details", async () => {
      const addressline1 = page.getByLabel("Address", { exact: true })
      const city = page.getByLabel("City")
      const Country = page.getByLabel("Country")
      const zip = page.getByLabel("zip code")
      const delSlot = page.getByLabel("preferred")
      const delInstruction = page.getByLabel("instruction")
      const saveAdd = page.getByRole("checkbox", { name: "Save this address" })

      await addressline1.fill("hnl street 2")
      await city.fill("GKN")
      await Country.selectOption({ label: "India" })
      await zip.fill("555333")
      await delSlot.selectOption({ index: 1 })
      await delInstruction.fill("Leave it at the door step if post 5pm")
      await saveAdd.check()

      await expect.soft(addressline1).toHaveValue("hnl street 2")
      await expect.soft(city).toHaveValue("GKN")
      await expect.soft(Country).toHaveValue("IN")
      await expect.soft(zip).toHaveValue("555333")
      await expect.soft(delSlot).toHaveValue("morning")
      await expect
        .soft(delInstruction)
        .toHaveValue("Leave it at the door step if post 5pm")
      await expect.soft(saveAdd).toBeChecked()
    })
    await test.step("Fill your interest", async () => {
      await page.getByRole("checkbox", { name: "Electronics" }).check()
      await expect(
        page.getByRole("checkbox", { name: "Electronics" }),
      ).toBeChecked()
    })
    await test.step("Fill payment details", async () => {
      const paymentOption = page.getByRole("radio", {
        name: "cash",
      })
      await paymentOption.check()
      await expect(paymentOption).toBeChecked()

      const promocode = page.getByPlaceholder("Enter code")
      await promocode.fill("PRE500")
      await expect(promocode).toHaveValue("PRE500")

      const qtySlider = page.getByRole("slider")
      await qtySlider.fill("100")
      await expect(qtySlider).toHaveValue("100")

      await page
        .getByRole("button", {
          name: "Place order",
        })
        .click()
      await expect(page.getByText("Order Placed Successfully!")).toBeVisible()
    })
  })
})
