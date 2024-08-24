import { test } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { TaskItem } from "../components/ui/TaskItem";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";

test.describe("Task Manager - Filter by Label", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);

    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);

    await taskManager.titleInput.fill("Task 1");
    await taskManager.descriptionInput.fill("Description 1");
    await taskManager.selectLabel.selectOption("Work");
    await taskManager.clickSubmitButton();

    await taskManager.titleInput.fill("Task 2");
    await taskManager.descriptionInput.fill("Description 2");
    await taskManager.selectLabel.selectOption("Social");
    await taskManager.clickSubmitButton();

    await taskManager.titleInput.fill("Task 3");
    await taskManager.descriptionInput.fill("Description 3");
    await taskManager.selectLabel.selectOption("Hobby");
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

  test("Filter tasks by label", async () => {
    const labelFilter = taskManager.filterItemsByLabel;
    await labelFilter.selectOption("Work");

    const workTasks = await taskLists.getAllTaskItems();
    for (const task of workTasks) {
      const item = new TaskItem(task);
      await item.checkLabel("Work");
    }

    await labelFilter.selectOption("Social");
    const socialTasks = await taskLists.getAllTaskItems();
    for (const task of socialTasks) {
      const item = new TaskItem(task);
      await item.checkLabel("Social");
    }

    await labelFilter.selectOption("Hobby");
    const hobbyTasks = await taskLists.getAllTaskItems();
    for (const task of hobbyTasks) {
      const item = new TaskItem(task);
      await item.checkLabel("Hobby");
    }
  });
});
