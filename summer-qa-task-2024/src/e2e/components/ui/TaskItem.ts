import { expect, Locator, Page } from "@playwright/test";

export class TaskItem {
  private taskItem: Locator;

  constructor(taskItem: Locator) {
    this.taskItem = taskItem;
  }

  // Locators
  private get itemTitle(): Locator {
    return this.taskItem.locator("h3.text-lg");
  }

  private get itemDescriptors(): Locator {
    return this.taskItem.locator("p.text-sm");
  }

  private get importanceLabel(): Locator {
    return this.taskItem.locator(
      'p.text-xs.text-gray-500:has-text("Importance:")'
    );
  }

  private get labelValue(): Locator {
    return this.taskItem.locator('p.text-xs.text-gray-500:has-text("Label:")');
  }

  private get completenessButton(): Locator {
    return this.taskItem.locator("button.bg-green-500");
  }

  private get unCompletenessButton(): Locator {
    return this.taskItem.locator("button.bg-fuchsia-500");
  }

  private get deleteButton(): Locator {
    return this.taskItem.locator("button.bg-red-500");
  }

  private get editButton(): Locator {
    return this.taskItem.locator("button.bg-yellow-500");
  }

  // Checks
  async checkItemTitle(expectedTitle: string): Promise<void> {
    await expect(this.itemTitle).toHaveText(expectedTitle);
  }

  async checkItemDescriptors(expectedDescriptor: string): Promise<void> {
    await expect(this.itemDescriptors).toHaveText(expectedDescriptor);
  }

  async checkImportance(expectedImportance: string): Promise<void> {
    await expect(this.importanceLabel).toHaveText(
      `Importance: ${expectedImportance}`
    );
  }

  async checkLabel(expectedLabel: string): Promise<void> {
    await expect(this.labelValue).toHaveText(`Label: ${expectedLabel}`);
  }

  async checkCompletenessButtonVisible(): Promise<void> {
    await expect(this.completenessButton).toBeVisible();
  }

  async checkUnCompletenessButtonVisible(): Promise<void> {
    await expect(this.unCompletenessButton).toBeVisible();
  }

  async checkEditButtonVisible(): Promise<void> {
    await expect(this.editButton).toBeVisible();
  }

  async checkDeleteButtonVisible(): Promise<void> {
    await expect(this.deleteButton).toBeVisible();
  }

  async clickCompletenessButton(): Promise<void> {
    await this.completenessButton.click();
  }

  async clickUnCompletenessButton(): Promise<void> {
    await this.unCompletenessButton.click();
  }

  async clickDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickEditButton(): Promise<void> {
    await this.editButton.click();
  }

  // Static method to locate task items by properties
  // Method works as workaround for bug with sorting. It allow combinations.test.ts execution
  static async getTaskItemByProperties(
    page: Page,
    importance: string,
    label: string
  ): Promise<Locator> {
    const allTasks = page.locator(".task-item");

    for (let i = 0; i < (await allTasks.count()); i++) {
      const taskItem = allTasks.nth(i);
      const importanceText = await taskItem
        .locator('p.text-xs.text-gray-500:has-text("Importance:")')
        .innerText();
      const labelText = await taskItem
        .locator('p.text-xs.text-gray-500:has-text("Label:")')
        .innerText();

      if (importanceText.includes(importance) && labelText.includes(label)) {
        return taskItem;
      }
    }

    throw new Error(
      `Task with Importance: ${importance} and Label: ${label} not found.`
    );
  }
}
