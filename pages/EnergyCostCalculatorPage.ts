import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricUseInput: Locator;
  private readonly gasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = this.page.getByLabel('Month');
    this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
    this.currentReadInput = this.page.getByLabel('Enter Current Read:');
    this.electricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
    this.gasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = this.page.locator('#e');
    this.electricGasServiceRadio = this.page.locator('#eg');
    this.howToReadBillButton = this.page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
    this.resetButton = this.page.locator('#rateCalCancelBtn');
    this.calculateButton = this.page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read value.
   */
  async enterPreviousRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read value.
   */
  async enterCurrentRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceRadio.click();
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
   * Returns the locator for the 'Calculate' button, which can be used to verify the calculator's visibility.
   * This acts as an indicator for the main calculator section visibility.
   */
  getCalculateButtonLocator(): Locator {
    return this.calculateButton;
  }

  /**
   * Returns the locator for the Estimated Gas use (Ccf) input field.
   * Note: This field is disabled by default.
   */
  getGasUseInputFieldLocator(): Locator {
    return this.gasUseInput;
  }
}
