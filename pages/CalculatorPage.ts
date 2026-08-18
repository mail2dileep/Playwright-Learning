import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  private readonly page: Page;

  // Locators
  private readonly monthSelect: Locator;
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
    this.monthSelect = page.getByLabel('Month');
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
   * Selects the service type (e.g., Electric, Electric and Gas).
   * @param serviceType 'Electric' or 'Electric and Gas'
   */
  async selectServiceType(serviceType: 'Electric' | 'Electric and Gas'): Promise<void> {
    if (serviceType === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (serviceType === 'Electric and Gas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${serviceType}`);
    }
  }

  /**
   * Enters the previous and current meter read values.
   * @param previousRead The value for the previous meter read.
   * @param currentRead The value for the current meter read.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
  }

  /**
   * Clicks the Calculate button to trigger the billing calculation.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the estimated electric use input field for assertions.
   * @returns Locator for the estimated electric use input.
   */
  getEstimatedElectricUseField(): Locator {
    return this.estimatedElectricUseInput;
  }

  /**
   * Retrieves the estimated gas use input field for assertions.
   * @returns Locator for the estimated gas use input.
   */
  getEstimatedGasUseField(): Locator {
    return this.estimatedGasUseInput;
  }

  /**
   * Navigates to a specific URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Retrieves the value of the 'Enter Previous Read' input field.
   * @returns The current value of the previous read input field.
   */
  async getPreviousReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Enter Current Read' input field.
   * @returns The current value of the current read input field.
   */
  async getCurrentReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Estimated Electric use (kWh)' input field.
   * @returns The current value of the estimated electric use field.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the value of the 'Estimated Gas use (Ccf)' input field.
   * @returns The current value of the estimated gas use field.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }
}