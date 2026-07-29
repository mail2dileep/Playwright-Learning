import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousElectricReadInput: Locator;
  private readonly currentElectricReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly resetButton: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousElectricReadInput = page.getByLabel('Enter Previous Read:');
    this.currentElectricReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e'); // recommendedLocator: locator('#e')
    this.electricGasServiceTypeRadio = page.locator('#eg'); // recommendedLocator: locator('#eg')
    this.calculateButton = page.locator('#validateMoveInBtn'); // recommendedLocator: locator('#validateMoveInBtn')
    this.resetButton = page.locator('#rateCalCancelBtn'); // recommendedLocator: locator('#rateCalCancelBtn')
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn'); // recommendedLocator: locator('#howToReadYourBillBtn')
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn'); // recommendedLocator: locator('#howToFindUsageBtn')
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects the specified service type using the radio buttons.
   * @param type The service type to select: 'Electric' or 'Electric and Gas'.
   */
  async selectServiceType(type: 'Electric' | 'Electric and Gas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceTypeRadio.click();
    } else if (type === 'Electric and Gas') {
      await this.electricGasServiceTypeRadio.click();
    } else {
      throw new Error(`Unsupported service type: ${type}`);
    }
  }

  /**
   * Checks if the 'Enter Previous Read:' input field is enabled.
   * @returns True if the input is enabled, false otherwise.
   */
  async isPreviousElectricReadInputEnabled(): Promise<boolean> {
    return await this.previousElectricReadInput.isEnabled();
  }

  /**
   * Checks if the 'Enter Previous Read:' input field is visible.
   * @returns True if the input is visible, false otherwise.
   */
  async isPreviousElectricReadInputVisible(): Promise<boolean> {
    return await this.previousElectricReadInput.isVisible();
  }

  /**
   * Checks if the 'Enter Current Read:' input field is enabled.
   * @returns True if the input is enabled, false otherwise.
   */
  async isCurrentElectricReadInputEnabled(): Promise<boolean> {
    return await this.currentElectricReadInput.isEnabled();
  }

  /**
   * Checks if the 'Enter Current Read:' input field is visible.
   * @returns True if the input is visible, false otherwise.
   */
  async isCurrentElectricReadInputVisible(): Promise<boolean> {
    return await this.currentElectricReadInput.isVisible();
  }

  /**
   * Checks if the 'Estimated Electric use (kWh):' input field is enabled.
   * @returns True if the input is enabled, false otherwise.
   */
  async isEstimatedElectricUseInputEnabled(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isEnabled();
  }

  /**
   * Checks if the 'Estimated Electric use (kWh):' input field is visible.
   * @returns True if the input is visible, false otherwise.
   */
  async isEstimatedElectricUseInputVisible(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is enabled.
   * @returns True if the input is enabled, false otherwise.
   */
  async isEstimatedGasUseInputEnabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isEnabled();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' input field is visible.
   * @returns True if the input is visible, false otherwise.
   */
  async isEstimatedGasUseInputVisible(): Promise<boolean> {
    return await this.estimatedGasUseInput.isVisible();
  }
}
