import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadioButton: Locator;
  private readonly electricGasServiceRadioButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadioButton = page.locator('#e');
    this.electricGasServiceRadioButton = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  // --- Navigation & Core Actions ---
  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in Playwright config.
   */
  async goto(): Promise<void> {
    await this.page.goto('/calculator');
  }

  // --- Input Actions ---
  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param value The previous read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param value The current read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadioButton.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricGasServiceType(): Promise<void> {
    await this.electricGasServiceRadioButton.check();
  }

  // --- Button Clicks ---
  /**
   * Clicks the 'Calculate' button to compute estimated usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all input fields and selections.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  // --- Getters for Verification/Assertions ---
  /**
   * Retrieves the current value from the 'Previous Read' input field.
   * @returns The previous read value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value from the 'Current Read' input field.
   * @returns The current read value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh) value from the corresponding display field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) value from the corresponding display field.
   * @returns The estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadioButton.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadioButton.isChecked();
  }

  /**
   * Checks if the 'Estimated Gas use' input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Retrieves the value attribute of the currently selected option in the month dropdown.
   * @returns The value of the selected month option, or null if nothing is selected.
   */
  async getSelectedMonthValue(): Promise<string | null> {
    return await this.monthDropdown.evaluate((el: HTMLSelectElement) => el.value);
  }

  /**
   * Retrieves all options from the month dropdown.
   * @returns An array of objects, each with 'value' and 'label' properties for each option.
   */
  async getMonthDropdownOptions(): Promise<{ value: string, label: string }[]> {
    return await this.monthDropdown.evaluate((select: HTMLSelectElement) =>
      Array.from(select.options).map(option => ({ value: option.value, label: option.label }))
    );
  }
}
