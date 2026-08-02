import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthSelect: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // Disabled, for reference, not interaction
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthSelect = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled per catalog
    this.electricServiceRadio = page.locator('#e');
    this.electricGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Rate Calculator page.
   * @param url The URL of the page to navigate to.
   */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Selects a month from the dropdown.
   * @param monthName The full text of the month option (e.g., 'August').
   */
  async selectMonth(monthName: string): Promise<void> {
    await this.monthSelect.selectOption({ label: monthName });
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value as a string.
   */
  async setPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async setCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Enters the estimated electric use in kWh.
   * @param kwhValue The estimated electric use value as a string.
   */
  async setEstimatedElectricUse(kwhValue: string): Promise<void> {
    await this.estimatedElectricUseInput.fill(kwhValue);
  }

  /**
   * Selects the service type radio button.
   * @param type 'Electric' or 'ElectricAndGas'.
   */
  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    if (type === 'Electric') {
      await this.electricServiceRadio.check();
    } else if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadio.check();
    }
  }

  /**
   * Clicks the Calculate button.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Gets the current value of the estimated electric use input.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUseValue(): Promise<string> {
    return this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Gets the current value of the previous meter read input.
   * @returns The string value of the previous meter read.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the current meter read input.
   * @returns The string value of the current meter read.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return this.currentReadInput.inputValue();
  }

  /**
   * Gets the currently selected month from the dropdown.
   * @returns The label of the selected month.
   */
  async getSelectedMonth(): Promise<string> {
    return this.monthSelect.locator('option:checked').innerText();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns True if 'Electric' is selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns True if 'Electric & Gas' is selected, false otherwise.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return this.electricGasServiceRadio.isChecked();
  }

  // NOTE: The 'Estimated Gas use (Ccf)' field is disabled per the locator catalog.
  // No interaction or assertion methods are provided for it as per strict requirements.
}
