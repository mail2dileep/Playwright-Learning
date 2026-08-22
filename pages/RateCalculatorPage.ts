import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
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
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  async selectServiceType(type: 'E' | 'EG'): Promise<void> {
    if (type === 'E') {
      await this.electricServiceRadio.check();
    } else if (type === 'EG') {
      await this.electricGasServiceRadio.check();
    }
  }

  async clickHowToReadYourBill(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  async getEstimatedGasUse(): Promise<string | null> {
    // Note: This input is disabled per locator catalog, so direct interaction might fail unless enabled by other actions.
    return await this.estimatedGasUseInput.inputValue();
  }

  // Placeholder methods for "Audience Selection" as per test steps, but locators are not in catalog.
  async selectAudience(audience: string): Promise<void> {
    // TODO: Locator not found in catalog for audience switcher.
    console.warn(`Attempted to select audience: ${audience}, but locator is not available.`);
  }

  async verifyNavigationAndCTAsTailoredTo(audience: string): Promise<void> {
    // TODO: Locators not found in catalog for navigation menu, labels, and CTAs.
    console.warn(`Attempted to verify navigation and CTAs for audience: ${audience}, but locators are not available.`);
  }
}
