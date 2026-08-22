import { Page, Locator } from "@playwright/test";

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
    this.monthDropdown = page.getByLabel("Month");
    this.previousReadInput = page.getByLabel("Enter Previous Read:");
    this.currentReadInput = page.getByLabel("Enter Current Read:");
    this.estimatedElectricUseInput = page.getByLabel("Estimated Electric use (kWh):");
    this.estimatedGasUseInput = page.getByLabel("Estimated Gas use (Ccf):");
    this.electricServiceRadio = page.locator("#e");
    this.electricGasServiceRadio = page.locator("#eg");
    this.howToReadYourBillButton = page.locator("#howToReadYourBillBtn");
    this.howToFindUsageButton = page.locator("#howToFindUsageBtn");
    this.resetButton = page.locator("#rateCalCancelBtn");
    this.calculateButton = page.locator("#validateMoveInBtn");
  }

  /**
   * Selects a month from the dropdown based on its value attribute.
   * @param monthValue The 'value' attribute of the month option (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption(monthValue);
  }

  /**
   * Enters the previous meter read value into the corresponding input field.
   * @param readValue The previous meter read value as a string.
   */
  async enterPreviousRead(readValue: string): Promise<void> {
    await this.previousReadInput.fill(readValue);
  }

  /**
   * Enters the current meter read value into the corresponding input field.
   * @param readValue The current meter read value as a string.
   */
  async enterCurrentRead(readValue: string): Promise<void> {
    await this.currentReadInput.fill(readValue);
  }

  /**
   * Retrieves the estimated electric use (kWh) from its input field.
   * @returns The estimated electric use as a string.
   */
  async getEstimatedElectricUse(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Retrieves the estimated gas use (Ccf) from its input field.
   * Note: This field is typically disabled by default in the UI.
   * @returns The estimated gas use as a string.
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
   * Clicks the 'Reset' button to clear form fields.
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

  /**
   * Checks if the 'Electric' service type radio button is currently selected.
   * @returns true if selected, false otherwise.
   */
  async isElectricServiceSelected(): Promise<boolean> {
    return await this.electricServiceRadio.isChecked();
  }

  /**
   * Checks if the 'Electric and Gas' service type radio button is currently selected.
   * @returns true if selected, false otherwise.
   */
  async isElectricAndGasServiceSelected(): Promise<boolean> {
    return await this.electricGasServiceRadio.isChecked();
  }
}
