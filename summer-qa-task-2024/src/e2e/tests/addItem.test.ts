import { test, expect } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { TaskItem } from "../components/ui/TaskItem";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";

test.describe("Task Manager - Add Task", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;

  const screenshotsDir = path.join(process.cwd(), "failed-screenshots");

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);
    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);
  });

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

  test("Add task with Required fields", async () => {
    const itemTitle = "Test task";

    await expect(taskManager.title).toBeVisible();

    await taskManager.titleInput.fill(itemTitle);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    const newTask = new TaskItem(newTaskLocator);

    await expect(newTaskLocator).toBeVisible();

    await newTask.checkItemTitle(itemTitle);
    await newTask.checkImportance("Medium");
    await newTask.checkLabel("Work");
    await newTask.checkUnCompletenessButtonVisible();
  });

  test("Add task with all fields", async () => {
    const itemTitle = "Test task";
    const itemDescription = "Description for the test task";
    const itemImportance = "High";
    const itemLabel = "Hobby";

    await expect(taskManager.title).toBeVisible();

    await taskManager.titleInput.fill(itemTitle);
    await taskManager.descriptionInput.fill(itemDescription);
    await taskManager.selectImportance.selectOption(itemImportance);
    await taskManager.selectLabel.selectOption(itemLabel);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    const newTask = new TaskItem(newTaskLocator);

    await expect(newTaskLocator).toBeVisible();

    await newTask.checkItemTitle(itemTitle);
    await newTask.checkItemDescriptors(itemDescription);
    await newTask.checkImportance(itemImportance);
    await newTask.checkLabel(itemLabel);
    await newTask.checkUnCompletenessButtonVisible();
  });

  test("Add an empty task", async () => {
    await expect(taskManager.title).toBeVisible();
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    await expect(newTaskLocator).toBeHidden();

    const taskItemsCount = await taskLists.countTaskItems();
    expect(taskItemsCount).toBe(0);
  });

  test("Add task and mark it complete/uncomplete", async () => {
    const itemTitle = "Test task";

    await expect(taskManager.title).toBeVisible();

    await taskManager.titleInput.fill(itemTitle);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    const newTask = new TaskItem(newTaskLocator);

    await expect(newTaskLocator).toBeVisible();

    await newTask.checkUnCompletenessButtonVisible();

    await newTask.clickUnCompletenessButton();
    await newTask.checkCompletenessButtonVisible();

    await newTask.clickCompletenessButton();
    await newTask.checkUnCompletenessButtonVisible();
  });
});
