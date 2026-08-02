import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Initially disabled, becomes enabled with 'ElectricGas' selection
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters a value into the 'Enter Previous Read:' input field.
   * @param value The text to fill into the input.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Enter Current Read:' input field.
   * @param value The text to fill into the input.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Enters a value into the 'Estimated Electric use (kWh):' input field.
   * @param value The text to fill into the input.
   */
  async enterEstimatedElectricUse(value: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(value);
  }

  /**
   * Enters a value into the 'Estimated Gas use (Ccf):' input field.
   * Requires 'Electric and Gas' service type to be selected for enablement.
   * @param value The text to fill into the input.
   */
  async enterEstimatedGasUse(value: string): Promise<void> {
    await this.estimatedGasUseInput.fill(value);
  }

  /**
   * Selects the service type radio button.
   * @param type 'Electric' or 'ElectricGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Gets the current value from the 'Estimated Electric use (kWh):' input field.
   * @returns The input value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the current value from the 'Estimated Gas use (Ccf):' input field.
   * @returns The input value as a string.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Gets the current value from the 'Enter Previous Read:' input field.
   * @returns The input value as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value from the 'Enter Current Read:' input field.
   * @returns The input value as a string.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the currently selected value from the 'Month' dropdown.
   * @returns The value attribute of the selected option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  /**
   * Workflow method to enter estimated usage values and trigger calculation.
   * Automatically selects 'Electric and Gas' to enable gas input.
   * @param electricUsage The value for estimated electric use.
   * @param gasUsage The value for estimated gas use.
   */
  async enterValuesAndCalculate(electricUsage: string, gasUsage: string): Promise<void> {
    await this.selectServiceType('ElectricGas'); // Select 'Electric and Gas' to enable the gas input field
    await this.enterEstimatedElectricUse(electricUsage);
    await this.enterEstimatedGasUse(gasUsage);
    await this.clickCalculate();
  }
}