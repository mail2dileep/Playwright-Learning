import { Page, Locator } from "@playwright/test";

export class CalculatorComponentPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // Disabled by default
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel("Month");
    this.previousReadInput = page.getByLabel("Enter Previous Read:");
    this.currentReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceRadio = page.locator("#e");
    this.electricGasServiceRadio = page.locator("#eg");
    this.calculateButton = page.locator("#validateMoveInBtn");
    this.resetButton = page.locator("#rateCalCancelBtn");
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the previous meter read input field.
   * @param value The previous read value to enter.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the current meter read input field.
   * @param value The current read value to enter.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Selects the service type radio button.
   * @param type 'electric' for Electric only, 'electric-gas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electric-gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric-gas') {
      await this.electricGasServiceRadio.click();
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the selected value of the month dropdown.
   * @returns The value attribute of the currently selected option.
   */
  async getMonthSelectedValue(): Promise<string> {
    return (await this.monthDropdown.inputValue());
  }

  /**
   * Retrieves the current value from the previous meter read input field.
   * @returns The value in the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
    return (await this.previousReadInput.inputValue());
  }

  /**
   * Retrieves the current value from the current meter read input field.
   * @returns The value in the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
    return (await this.currentReadInput.inputValue());
  }

  /**
   * Retrieves the estimated electric use (kWh) value.
   * @returns The value in the estimated electric use input.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return (await this.estimatedElectricUseInput.inputValue());
  }

  /**
   * Checks if the electric service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the electric and gas service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  /**
   * Checks if the previous read input field is editable.
   * @returns True if enabled, false otherwise.
   */
  async isPreviousReadInputEditable(): Promise<boolean> {
    return await this.previousReadInput.isEnabled();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }
}