import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricAndGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from the catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    // The 'Estimated Gas use (Ccf):' input is disabled, so no direct interaction methods are provided.
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in playwright.config.ts
   */
  async navigateTo(): Promise<void> {
    // This path '/rate-calculator' is an assumption. Adjust based on actual application routing.
    await this.page.goto('/rate-calculator');
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The 'value' attribute of the month option (e.g., 'm12' for December).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the input field.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value into the input field.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type using the radio buttons.
   * @param type 'Electric' to select the electric service type, 'ElectricAndGas' for both.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceTypeRadio.click();
    } else if (type === 'ElectricAndGas') {
      await this.electricAndGasServiceTypeRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear form values.
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

  /**
   * Retrieves the current value of the estimated electric use input.
   * @returns A Promise that resolves to the string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current selected month's value attribute from the dropdown.
   * @returns A Promise that resolves to the string value of the selected month option.
   */
  async getSelectedMonth(): Promise<string> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous read input.
   * @returns A Promise that resolves to the string value of the previous read input.
   */
  async getPreviousReadValue(): Promise<string> {
      return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current read input.
   * @returns A Promise that resolves to the string value of the current read input.
   */
  async getCurrentReadValue(): Promise<string> {
      return await this.currentReadInput.inputValue();
  }

  /**
   * Checks if the Electric service type radio button is checked.
   * @returns A Promise that resolves to a boolean indicating if the radio is checked.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
      return await this.electricServiceTypeRadio.isChecked();
  }
}
