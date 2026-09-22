import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This is disabled according to catalog
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
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
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
   * Selects a month from the dropdown.
   * @param monthValue The value of the month to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read as a string.
   */
  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read as a string.
   */
  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasServiceType(): Promise<void> {
    await this.electricGasServiceRadio.check();
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
   * Clicks the 'Reset' button.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the current value of the month dropdown.
   * @returns The value of the selected option in the month dropdown.
   */
  async getMonthDropdownCurrentValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the current value of the previous meter read input field.
   * @returns The value of the previous meter read input.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the current value of the current meter read input field.
   * @returns The value of the current meter read input.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use (kWh).
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the Electric service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the Electric and Gas service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricAndGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  // Method to perform a full calculation workflow for electric service
  async calculateElectricUsage(month: string, prevRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(month);
    await this.enterPreviousMeterRead(prevRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectElectricServiceType();
    await this.clickCalculate();
  }

  // Method to perform a full calculation workflow for electric and gas service
  async calculateElectricAndGasUsage(month: string, prevRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(month);
    await this.enterPreviousMeterRead(prevRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectElectricAndGasServiceType();
    await this.clickCalculate();
  }
}