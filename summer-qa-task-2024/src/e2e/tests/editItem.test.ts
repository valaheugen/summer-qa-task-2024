import { test, expect } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { TaskItem } from "../components/ui/TaskItem";
import { EditTaskItem } from "../components/ui/EditTaskItem";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";

test.describe("Task Manager - Edit Task", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);

    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);

    const originalTitle = "Precondition Task";
    const originalDescription = "Precondition Task";

    await taskManager.titleInput.fill(originalTitle);
    await taskManager.descriptionInput.fill(originalDescription);
    await taskManager.clickSubmitButton();

    const newTaskLocator = taskLists.getTaskItem(0);
    await expect(newTaskLocator).toBeVisible();
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

  test("Edit a task from the list", async ({ page }) => {
    const itemTitle = "Test task";
    const itemDescription = "Test Description";

    const taskLocator = taskLists.getTaskItem(0);
    const itemTask = new TaskItem(taskLocator);

    // Edit the task
    await itemTask.checkEditButtonVisible();
    await itemTask.clickEditButton();

    const formLocator = page.locator(".task-item");
    const editItem = new EditTaskItem(page, formLocator);

    await editItem.fillTitle(itemTitle);
    await editItem.fillDescription(itemDescription);
    await editItem.selectImportance("Medium");
    await editItem.selectLabel("Work");
    await editItem.clickSaveButton();

    // Check the edited task
    await itemTask.checkItemTitle(itemTitle);
    await itemTask.checkItemDescriptors(itemDescription);
    await itemTask.checkImportance("Medium");
    await itemTask.checkLabel("Work");
    await itemTask.checkCompletenessButtonVisible();
  });

  test("Cancel edit a task from the list", async ({ page }) => {
    const itemTitle = "Test task";
    const itemDescription = "Test Description";

    const originalTitle = "Precondition Task";
    const originalDescription = "Precondition Task";

    const taskLocator = taskLists.getTaskItem(0);
    const itemTask = new TaskItem(taskLocator);

    // Edit the task
    await itemTask.checkEditButtonVisible();
    await itemTask.clickEditButton();

    const formLocator = page.locator(".task-item");
    const editItem = new EditTaskItem(page, formLocator);

    await editItem.fillTitle(itemTitle);
    await editItem.fillDescription(itemDescription);
    await editItem.selectImportance("High");
    await editItem.selectLabel("Hobby");
    await editItem.clickCancelButton();

    // Check the edited task is not changed
    await itemTask.checkItemTitle(originalTitle);
    await itemTask.checkItemDescriptors(originalDescription);
    await itemTask.checkImportance("Medium");
    await itemTask.checkLabel("Work");
    await itemTask.checkCompletenessButtonVisible();
  });
});
