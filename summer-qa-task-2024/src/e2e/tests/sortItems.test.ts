import { test, expect } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";

test.describe("Task Manager - Sort by Importance", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);

    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);

    await taskManager.titleInput.fill("Task 1");
    await taskManager.descriptionInput.fill("Description 1");
    await taskManager.selectImportance.selectOption("Low");
    await taskManager.clickSubmitButton();

    await taskManager.titleInput.fill("Task 2");
    await taskManager.descriptionInput.fill("Description 2");
    await taskManager.selectImportance.selectOption("Medium");
    await taskManager.clickSubmitButton();

    await taskManager.titleInput.fill("Task 3");
    await taskManager.descriptionInput.fill("Description 3");
    await taskManager.selectImportance.selectOption("High");
    await taskManager.clickSubmitButton();
  });

  const screenshotsDir = path.join(process.cwd(), "failed-screenshots");

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  test.afterEach(async ({ page }) => {
    const testInfo = test.info();
    const status = testInfo.status;
    const title = testInfo.title;

    if (status === "failed") {
      const screenshotPath = path.join(
        screenshotsDir,
        `${title}-screenshot-${Date.now()}-${status}.png`
      );
      await page.screenshot({ path: screenshotPath });
    }
  });

  test("Sort tasks by importance (Descending)", async () => {
    const labelFilter = taskManager.sortingItemsByImportance;
    await labelFilter.selectOption("Sort by Importance (Descending)");

    let importanceLabels = await taskLists.getImportanceLabels();
    let sortedLabels = ["High", "Medium", "Low"];
    expect(importanceLabels).toEqual(sortedLabels);
  });

  test("Sort tasks by importance (Ascending)", async () => {
    const labelFilter = taskManager.sortingItemsByImportance;
    await labelFilter.selectOption("Sort by Importance (Ascending)");

    let importanceLabels = await taskLists.getImportanceLabels();
    let sortedLabels = ["Low", "Medium", "High"];
    expect(importanceLabels).toEqual(sortedLabels);
  });
});
