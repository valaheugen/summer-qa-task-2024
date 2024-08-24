import { test, expect } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { TaskItem } from "../components/ui/TaskItem";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";

test.describe("Task Manager - Delete Tasks", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);
    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);
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

  test("Delete an Item from List", async () => {
    const itemTitle = "Test task";

    await expect(taskManager.title).toBeVisible();

    await taskManager.titleInput.fill(itemTitle);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    const newTask = new TaskItem(newTaskLocator);

    await expect(newTaskLocator).toBeVisible();

    await newTask.checkItemTitle(itemTitle);

    await newTask.checkDeleteButtonVisible();
    await newTask.clickDeleteButton();
    await expect(newTaskLocator).toBeHidden();

    const taskItemsCount = await taskLists.countTaskItems();
    expect(taskItemsCount).toBe(0);
  });

  test("Delete an Item from List and refresh page", async ({ page }) => {
    const itemTitle = "Test task";

    await expect(taskManager.title).toBeVisible();

    await taskManager.titleInput.fill(itemTitle);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    const newTask = new TaskItem(newTaskLocator);

    await expect(newTaskLocator).toBeVisible();

    await newTask.checkItemTitle(itemTitle);

    await newTask.checkDeleteButtonVisible();
    await newTask.clickDeleteButton();
    await expect(newTaskLocator).toBeHidden();

    const taskItemsCount = await taskLists.countTaskItems();
    expect(taskItemsCount).toBe(0);

    await page.reload();

    const itemsCountAfterRefresh = await taskLists.countTaskItems();
    expect(itemsCountAfterRefresh).toBe(0);
  });
});
