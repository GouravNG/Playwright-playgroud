import { expect, Locator, test } from "@playwright/test"

test("Drag and drop", async ({ page }) => {
  let backlog: Locator
  let inProgress: Locator
  let done: Locator

  await test.step("Drag from backlog to inprogress", async () => {
    await page.goto("/kanban")
    await expect(page).toHaveURL("/kanban")

    backlog = page.getByTestId("column-backlog")
    inProgress = page.getByTestId("column-in-progress")
    done = page.getByTestId("column-done")

    await backlog.getByRole("heading", { name: "Design" }).dragTo(inProgress)
    await expect(inProgress.getByText("Design System Tokens")).toBeVisible()
    await expect(
      inProgress.getByRole("heading", { name: "Design" }),
    ).not.toContainClass("line-through")
  })

  await test.step("Drag from inprogress to done", async () => {
    await inProgress.getByRole("heading", { name: "Design" }).dragTo(done)
    await expect(done.getByText("Design System Tokens")).toBeVisible()
    await expect(done.getByRole("heading", { name: "Design" })).toContainClass(
      "line-through",
    )
  })
})
