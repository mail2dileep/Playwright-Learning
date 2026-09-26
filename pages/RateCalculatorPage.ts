import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators are declared as public readonly to allow assertions in the test spec
  // while strictly adhering to "Keep assertions in the test layer" and not including
  // expect() statements within the Page Object methods.
  public readonly monthDropdown: Locator;
  public readonly previousReadInput: Locator;
  public readonly currentReadInput: Locator;
  public readonly estimatedElectricUseInput: Locator;
  public readonly estimatedGasUseInput: Locator;
  public readonly electricServiceTypeRadio: Locator;
  public readonly electricAndGasServiceTypeRadio: Locator;
  public readonly howToReadYourBillButton: Locator;
  public readonly howToFindUsageButton: Locator;
  public readonly resetButton: Locator;
  public readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using recommendedLocator from catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricAndGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the rate calculator page.
   * @param url The URL of the rate calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The 'value' attribute of the month option (e.g., 'm08' for August).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous and current meter readings.
   * @param previousRead The value for the previous meter read input.
   * @param currentRead The value for the current meter read input.
   */
  async enterMeterReads(previousRead: string, currentRead: string): Promise<void> {
    await this.previousReadInput.fill(previousRead);
    await this.currentReadInput.fill(currentRead);
  }

  /**
   * Selects the service type radio button.
   * @param type 'electric' for Electric service, 'electricAndGas' for Electric and Gas service.
   */
  async selectServiceType(type: 'electric' | 'electricAndGas'): Promise<void> {
    if (type === 'electric') {
      await this.electricServiceTypeRadio.check();
    } else if (type === 'electricAndGas') {
      await this.electricAndGasServiceTypeRadio.check();
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
   * Clicks the 'Reset' button.
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
}