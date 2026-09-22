import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value as a string.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value as a string.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the service type (Electric or ElectricAndGas).
   * @param type 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'ElectricAndGas') {
      await this.electricAndGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the value from the Estimated Electric use (kWh) input field.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the current value of the previous read input field.
   * @returns The current value of the previous read input as a string.
   */
  async getPreviousReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Checks if the Estimated Gas use (Ccf) input field is disabled.
   * @returns A boolean indicating if the field is disabled.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Clicks the Reset button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the "How to Read Your Bill" button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the "How to Find Usage" button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }
}
