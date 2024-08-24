import { BasePage } from "../BasePage";

export class TaskManager extends BasePage {
  readonly title = this.page.locator("h1.text-2xl");

  readonly titleInput = this.page.locator('input[placeholder="Task Title"]');
  readonly descriptionInput = this.page.locator(".grid textarea");

  readonly titleImportance = this.page.locator("div.flex-1:nth-of-type(1)");
  readonly titleLabel = this.page.locator("div.flex-1:nth-of-type(2)");

  readonly selectImportance = this.page.locator(
    '[class*="flex gap-2"] select[class*="border"]:nth-of-type(1)'
  );
  readonly selectLabel = this.page.locator(
    '[class*="flex gap-2"] select[class*="border"]:nth-of-type(2)'
  );
  readonly filterItemsByLabel = this.page.locator(
    '[class*="filter-sort"] select[class*="border"]:nth-of-type(1)'
  );
  readonly sortingItemsByImportance = this.page.locator(
    '[class*="filter-sort"] select[class*="border"]:nth-of-type(2)'
  );
  readonly submitButton = this.page.locator('button:text("Add Task")');

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  async clearForm(): Promise<void> {
    await this.page.fill('input[placeholder="Task Title"]', "");
    await this.page.fill(".grid textarea", "");
  }
}
