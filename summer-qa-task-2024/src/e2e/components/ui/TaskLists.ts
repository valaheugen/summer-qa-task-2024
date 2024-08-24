import { expect, Locator, Page } from "playwright/test";
import { BasePage } from "../BasePage";

export class TaskLists extends BasePage {
  private taskListSpace: Locator;
  private taskItems: Locator;

  constructor(page: Page) {
    super(page);
    this.taskListSpace = this.page.locator(".task-list");
    this.taskItems = this.taskListSpace.locator(".task-item");
  }

  getTaskItem(index: number): Locator {
    return this.taskItems.nth(index);
  }

  async checkTaskItemVisibility(index: number): Promise<void> {
    await expect(this.getTaskItem(index)).toBeVisible();
  }

  async getAllTaskItems(): Promise<Locator[]> {
    return this.taskItems.all();
  }

  async countTaskItems(): Promise<number> {
    return this.taskItems.count();
  }

  async getImportanceLabels(): Promise<string[]> {
    const importanceLabels: string[] = [];
    const tasks = await this.getAllTaskItems();

    for (const task of tasks) {
      const importance = await task
        .locator('p.text-xs.text-gray-500:has-text("Importance:")')
        .innerText();
      importanceLabels.push(importance.replace("Importance: ", ""));
    }

    return importanceLabels;
  }
}
