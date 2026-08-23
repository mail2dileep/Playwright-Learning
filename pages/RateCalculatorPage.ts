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
    // Initialize locators using recommended methods from the Locator Catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Locator for a disabled input
    this.electricServiceRadio = page.locator('#e'); // Using ID as per recommendedLocator
    this.electricGasServiceRadio = page.locator('#eg'); // Using ID as per recommendedLocator
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * Assumes the base URL is configured in Playwright config and '/rate-calculator' is the path.
   */
  async goto(): Promise<void> {
    await this.page.goto('/rate-calculator', { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits for a key element on the page to be visible, indicating the page has loaded.
   */
  async waitForPageLoad(): Promise<void> {
    await this.monthDropdown.waitFor({ state: 'visible' });
  }

  /**
   * Selects a month from the billing month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm10' for October).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter reading into the corresponding input field.
   * @param readValue The previous meter reading value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter reading into the corresponding input field.
   * @param readValue The current meter reading value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the type of service (Electric only or Electric & Gas).
   * @param type 'electric' for Electric only, 'electric_gas' for Electric & Gas.
   */
  async selectServiceType(type: 'electric' | 'electric_gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric_gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the 'Calculate' button to perform the bill calculation.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear all input fields to their default states.
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

  // Getter methods for retrieving element states for assertions

  /**
   * Gets the value of the currently selected option in the month dropdown.
   * @returns The 'value' attribute of the selected option (e.g., 'm10').
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the value from the 'Enter Previous Read:' input field.
   * @returns The string value from the input field.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the value from the 'Enter Current Read:' input field.
   * @returns The string value from the input field.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the value from the 'Estimated Electric use (kWh):' output field.
   * @returns The string value representing the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is currently selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is currently selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is disabled.
   * @returns True if the input is disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
      return await this.estimatedGasUseInput.isDisabled();
  }
}
