import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly previousElectricMeterReadInput: Locator;
  private readonly monthDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousElectricMeterReadInput = this.page.getByLabel('Enter Previous Read:');
  }

  /**
   * Navigates to the calculator page. This method should be implemented if not handled by a global setup.
   * @param url The URL of the calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Enters a value into the previous electric meter read input field.
   * @param value The value to enter.
   */
  async enterPreviousElectricMeterRead(value: string): Promise<void> {
    await this.previousElectricMeterReadInput.fill(value);
  }

  /**
   * Retrieves the current value from the previous electric meter read input field.
   * @returns The current value of the input field.
   */
  async getPreviousElectricMeterReadValue(): Promise<string> {
    return await this.previousElectricMeterReadInput.inputValue();
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Retrieves the currently selected value from the month dropdown.
   * @returns The value attribute of the currently selected option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }
}
