import { Page, Locator } from '@playwright/test';

export class ConsumptionCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousMeterReadInput: Locator;
  private readonly currentMeterReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator; // For assertion
  private readonly estimatedGasUseInput: Locator; // For assertion of disabled state
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
    this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the consumption calculator page.
   * @param url The URL to navigate to.
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
   * Enters the previous meter reading.
   * @param readValue The previous meter read value.
   */
  async enterPreviousMeterRead(readValue: string): Promise<void> {
    await this.previousMeterReadInput.fill(readValue);
  }

  /**
   * Enters the current meter reading.
   * @param readValue The current meter read value.
   */
  async enterCurrentMeterRead(readValue: string): Promise<void> {
    await this.currentMeterReadInput.fill(readValue);
  }

  /**
   * Selects the Electric service type radio button.
   */
  async selectServiceTypeElectric(): Promise<void> {
    await this.electricServiceTypeRadio.click();
  }

  /**
   * Selects the Electric and Gas service type radio button.
   */
  async selectServiceTypeElectricGas(): Promise<void> {
    await this.electricGasServiceTypeRadio.click();
  }

  /**
   * Clicks the Calculate button to compute consumption.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Clicks the Reset button.
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

  /**
   * Retrieves the selected month value from the dropdown.
   * @returns The string value of the selected month.
   */
  async getSelectedMonthValue(): Promise<string> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the value from the previous meter read input field.
   * @returns The string value of the previous meter read.
   */
  async getPreviousMeterReadValue(): Promise<string> {
    return await this.previousMeterReadInput.inputValue();
  }

  /**
   * Retrieves the value from the current meter read input field.
   * @returns The string value of the current meter read.
   */
  async getCurrentMeterReadValue(): Promise<string> {
    return await this.currentMeterReadInput.inputValue();
  }

  /**
   * Retrieves the estimated electric use value.
   * @returns The string value of the estimated electric use.
   */
  async getEstimatedElectricUse(): Promise<string | null> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use input field is disabled.
   * @returns True if the field is disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the Electric service type radio button is selected.
   * @returns True if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceTypeRadio.isChecked();
  }

  /**
   * Performs the calculation of electric consumption workflow.
   * @param monthValue The value of the month (e.g., 'm06').
   * @param previousRead The previous meter reading.
   * @param currentRead The current meter reading.
   */
  async calculateElectricConsumption(monthValue: string, previousRead: string, currentRead: string): Promise<void> {
    await this.selectMonth(monthValue);
    await this.enterPreviousMeterRead(previousRead);
    await this.enterCurrentMeterRead(currentRead);
    await this.selectServiceTypeElectric();
    await this.clickCalculate();
  }
}