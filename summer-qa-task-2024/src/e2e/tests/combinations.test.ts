import { test } from "@playwright/test";
import { TaskManager } from "../components/ui/TaskManager";
import { TaskLists } from "../components/ui/TaskLists";
import { urls } from "../components/urls";
import path from "path";
import fs from "fs";
import { TaskItem } from "../components/ui/TaskItem";

const importances: string[] = ["High", "Medium", "Low"];
const labels: string[] = ["Work", "Social", "Home", "Hobby"];

const clearDirectory = (dirPath: string): void => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);
      fs.unlinkSync(filePath);
    });
  }
};

test.describe("Task Manager - All Combinations Test", () => {
  let taskManager: TaskManager;
  let taskLists: TaskLists;
  const screenshotsDir = path.join(process.cwd(), "screenshots");

  test.beforeEach(async ({ page }) => {
    await page.goto(urls.BASE_URL);
    taskManager = new TaskManager(page);
    taskLists = new TaskLists(page);

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir);
    } else {
      clearDirectory(screenshotsDir);
    }
  });

  test("Generate all combinations of task properties and take screenshots", async ({
    page,
  }) => {
    const now = new Date();
    const dateString = now.toISOString().replace(/T/, "_").replace(/\..+/, "");

    for (const importance of importances) {
      for (const label of labels) {
        await taskManager.titleInput.fill(`Task ${importance}-${label}`);
        await taskManager.descriptionInput.fill("Description for testing");
        await taskManager.selectImportance.selectOption(importance);
        await taskManager.selectLabel.selectOption(label);
        await taskManager.clickSubmitButton();

        await page.waitForTimeout(1000);

        const screenshotPath = path.join(
          process.cwd(),
          "screenshots",
          `${dateString}-task-${importance}-${label}-before-completeness.png`
        );
        await page.screenshot({ path: screenshotPath });

        // Find the task with the specific importance and label. Workaround due to issue with sorting
        const taskLocator = await TaskItem.getTaskItemByProperties(
          page,
          importance,
          label
        );
        await taskLocator.waitFor({ state: "visible", timeout: 30000 });
        const task = new TaskItem(taskLocator);

        await task.clickCompletenessButton();

        const screenshotPath2 = path.join(
          process.cwd(),
          "screenshots",
          `${dateString}-task-${importance}-${label}-after-completeness.png`
        );
        await page.screenshot({ path: screenshotPath2 });
        await taskManager.clearForm();
      }
    }
  });
});
