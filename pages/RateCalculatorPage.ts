import { Page, Locator, expect } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Selects a month from the Month dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param value The previous read value as a string.
   */
  async enterPreviousRead(value: string): Promise<void> {
    await this.previousReadInput.fill(value);
  }

  /**
   * Enters the current meter read value.
   * @param value The current read value as a string.
   */
  async enterCurrentRead(value: string): Promise<void> {
    await this.currentReadInput.fill(value);
  }

  /**
   * Retrieves the estimated electric use value.
   * @returns The estimated electric use value as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use value. Note: This field is disabled based on the locator catalog.
   * @returns The estimated gas use value as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    await expect(this.estimatedGasUseInput).toBeDisabled();
    return this.estimatedGasUseInput.inputValue();
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricService(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.check();
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
   * Clicks the 'Reset' button to clear the form.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button to submit the form.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  // --- Methods for 'Verify Audience Preference Persistence' test, not found in RateCalculatorPage context --- 
  /**
   * Selects the audience preference.
   * // TODO: Locator not found in catalog for audience switcher (e.g., 'SMB Advertiser').
   * @param preference The audience preference to select.
   */
  async selectAudiencePreference(preference: string): Promise<void> {
    console.warn(`Attempted to select audience preference '${preference}'. Locator for audience switcher not found in catalog. `);
    // For demonstration, simulating action if it were available:
    // await this.audienceSwitcherLocator.selectOption(preference);
  }

  /**
   * Retrieves the currently set audience preference.
   * // TODO: Locator not found in catalog for audience preference display.
   * @returns A promise that resolves to the current audience preference text.
   */
  async getAudiencePreference(): Promise<string> {
    console.warn("Attempted to get audience preference. Locator for audience preference display not found in catalog.");
    // For demonstration, simulating a returned value if it were available:
    // return this.currentAudienceDisplayLocator.textContent() || '';
    return Promise.resolve(''); // Return an empty string or throw an error to indicate absence
  }
}
