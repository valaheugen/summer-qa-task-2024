import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

export class EditTaskItem extends BasePage {
  private form: Locator;

  constructor(page: Page, form: Locator) {
    super(page);
    this.form = form;
  }

  // Locators
  private get titleInput(): Locator {
    return this.form.locator('input[placeholder="Title"]');
  }

  private get descriptionTextarea(): Locator {
    return this.form.locator("textarea.block");
  }

  private get importanceSelect(): Locator {
    return this.form.locator("select").nth(0);
  }

  private get labelSelect(): Locator {
    return this.form.locator("select").nth(1);
  }

  private get saveButton(): Locator {
    return this.form.locator('button:has-text("Save")');
  }

  private get cancelButton(): Locator {
    return this.form.locator('button:has-text("Cancel")');
  }

  // Methods
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionTextarea.fill(description);
  }

  async selectImportance(importance: string): Promise<void> {
    await this.importanceSelect.selectOption(importance);
  }

  async selectLabel(label: string): Promise<void> {
    await this.labelSelect.selectOption(label);
  }

  async clickSaveButton(): Promise<void> {
    await this.saveButton.click();
  }

  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }
}
