import { expect, test } from "@playwright/test"
test.describe("file uploaad downlaod", () => {
  test.beforeEach("navigate to the page", async ({ page }) => {
    await page.goto("https://play-playground.vercel.app/files")
  })
  test("upload single file", async ({ page }) => {
    const singleUploadBtn = await page
      .getByRole("button", {
        name: "choose file",
      })
      .first()
    await singleUploadBtn.setInputFiles(
      "c:/Users/goura/Desktop/Gourav_resume.pdf",
    )
    await expect(page.getByText("Uploaded:")).toBeVisible()
  })

  test("upload multiple files", async ({ page }) => {
    await page
      .getByRole("button", { name: "choose" })
      .nth(1)
      .setInputFiles([
        "c:/Users/goura/Desktop/Gourav_resume.pdf",
        "c:/Users/goura/Desktop/Gourav_555_resume.pdf",
      ])
    await expect(page.getByText("Selected :")).toBeVisible()
  })

  test("drop zone ", async ({ page }) => {
    const [file] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByTestId("dropzone-click-area").click(),
    ])
    await file.setFiles("c:/Users/goura/Desktop/Gourav_resume.pdf")
    expect(page.getByText("File: Gourav_resume.pdf")).toBeVisible()
  })

  test("downlaod", async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download" }).click(),
    ])
    await expect(download.suggestedFilename()).toBe("orders-export.csv")
    await download.saveAs("downlaoded-order-export.csv")
  })
})
