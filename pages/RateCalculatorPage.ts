import { Page, Locator } from "@playwright/test";

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
   * Navigates to the rate calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm03' for March).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param read The previous meter read.
   */
  async enterPreviousMeterRead(read: string): Promise<void> {
    await this.previousReadInput.fill(read);
  }

  /**
   * Gets the previous meter read value.
   * @returns The string value of the previous meter read input.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return (await this.previousReadInput.inputValue()).trim();
  }

  /**
   * Enters the current meter read value.
   * @param read The current meter read.
   */
  async enterCurrentMeterRead(read: string): Promise<void> {
    await this.currentReadInput.fill(read);
  }

  /**
   * Gets the current meter read value.
   * @returns The string value of the current meter read input.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return (await this.currentReadInput.inputValue()).trim();
  }

  /**
   * Selects the service type.
   * @param type 'Electric' for electric only, 'ElectricAndGas' for both.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricAndGasServiceRadio.check();
    }
  }

  /**
   * Clicks the 'Calculate' button.
   */
  async clickCalculateButton(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the 'Reset' button.
   */
  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'How to Read Your Bill' button.
   */
  async clickHowToReadYourBillButton(): Promise<void> {
    await this.howToReadYourBillButton.click();
  }

  /**
   * Clicks the 'How to Find Usage' button.
   */
  async clickHowToFindUsageButton(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Gets the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return (await this.estimatedElectricUseInput.inputValue()).trim();
  }

  /**
   * Gets the estimated gas use value.
   * @returns The string value of the estimated gas use.
   */
  async getEstimatedGasUseValue(): Promise<string> {
    return (await this.estimatedGasUseInput.inputValue()).trim();
  }

  /**
   * Checks if the estimated gas use input is disabled.
   * @returns True if disabled, false otherwise.
   */
  async isEstimatedGasUseInputDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Gets the selected month value from the dropdown.
   * @returns The value attribute of the selected month option.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Checks if the Electric service radio button is checked.
   * @returns True if checked, false otherwise.
   */
  async isElectricServiceChecked(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the Electric and Gas service radio button is checked.
   * @returns True if checked, false otherwise.
   */
  async isElectricAndGasServiceChecked(): Promise<boolean> {
    return await this.electricAndGasServiceRadio.isChecked();
  }
}
