import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
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
   * Selects a month from the dropdown.
   * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthSelect.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Retrieves the currently displayed estimated electric use.
   * @returns A promise that resolves to the estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the currently displayed estimated gas use.
   * Note: This field is disabled, so it's for display/verification only.
   * @returns A promise that resolves to the estimated gas use as a string.
   */
  async getEstimatedGasUse(): Promise<string> {
    return await this.estimatedGasUseInput.inputValue();
  }

  /**
   * Selects the 'Electric' service type radio button.
   */
  async selectElectricServiceType(): Promise<void> {
    await this.electricServiceRadio.check();
  }

  /**
   * Selects the 'Electric & Gas' service type radio button.
   */
  async selectElectricGasServiceType(): Promise<void> {
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
   */  async clickHowToFindUsage(): Promise<void> {
    await this.howToFindUsageButton.click();
  }

  /**
   * Clicks the 'Reset' button to clear form fields.
   */
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  /**
   * Clicks the 'Calculate' button to compute usage.
   */
  async clickCalculate(): Promise<void> {
    await this.calculateButton.click();
  }

  /**
   * Retrieves the value of the currently selected month in the dropdown.
   * @returns A promise that resolves to the selected month's value as a string.
   */
  async getCurrentlySelectedMonthValue(): Promise<string> {
    return await this.monthSelect.inputValue();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns A promise that resolves to true if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric & Gas' service type radio button is selected.
   * @returns A promise that resolves to true if selected, false otherwise.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }

  /**
   * Performs a complete usage calculation workflow.
   * @param month The value attribute of the month to select (e.g., 'm07').
   * @param prevRead The previous meter read value.
   * @param currentRead The current meter read value.
   * @param serviceType The type of service: 'Electric' or 'Electric & Gas'.
   */
  async calculateUsage(month: string, prevRead: string, currentRead: string, serviceType: 'Electric' | 'Electric & Gas'): Promise<void> {
    await this.selectMonth(month);
    await this.enterPreviousRead(prevRead);
    await this.enterCurrentRead(currentRead);
    if (serviceType === 'Electric') {
      await this.selectElectricServiceType();
    } else if (serviceType === 'Electric & Gas') {
      await this.selectElectricGasServiceType();
    }
    await this.clickCalculate();
  }
}