import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
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

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Rate Calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm08' for August).
   */
  async selectBillingMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Selects the service type.
   * @param type 'electric' for Electric only, 'electric_gas' for Electric and Gas.
   */
  async selectServiceType(type: 'electric' | 'electric_gas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'electric_gas') {
      await this.electricGasServiceRadio.click();
    }
  }

  /**
   * Clicks the Calculate button to determine estimated usage.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button to clear all inputs.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Retrieves the estimated electric use value.
   * @returns The estimated electric use in kWh as a string.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value.
   * @returns The estimated gas use in Ccf as a string.
   */
  async getEstimatedGasUse(): Promise<string | null> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
    // Depending on the application, this might open a modal or navigate to a new page.
    // Further actions or assertions would follow based on that behavior.
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
    // Similar to 'How to Read Your Bill', this might open a modal or navigate.
  }
}