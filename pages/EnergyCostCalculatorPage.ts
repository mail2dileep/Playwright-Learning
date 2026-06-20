import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInputField: Locator;
  private readonly currentReadInputField: Locator;
  private readonly estimatedElectricUseField: Locator;
  private readonly estimatedGasUseField: Locator;
  private readonly electricOnlyServiceRadio: Locator;
  private readonly electricAndGasServiceRadio: Locator;
  private readonly howToReadYourBillButton: Locator;
  private readonly howToFindUsageButton: Locator;
  private readonly resetButton: Locator;
  private readonly calculateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInputField = page.getByLabel('Enter Previous Read:');
    this.currentReadInputField = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseField = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseField = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyServiceRadio = page.locator('#e');
    this.electricAndGasServiceRadio = page.locator('#eg');
    this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
    this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    this.resetButton = page.locator('#rateCalCancelBtn');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the specified URL.
   * @param url The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the main Rate Calculator section is visible.
   * Uses the 'Calculate' button as a prominent indicator for the section's visibility.
   * @returns A promise that resolves to true if the section is visible, false otherwise.
   */
  async isRateCalculatorSectionVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }

  /**
   * Selects a month from the month dropdown.
   * @param monthValue The value attribute of the month option to select (e.g., 'm06' for June).
   */
  async selectMonth(monthValue: string): Promise<void> {
    await this.monthDropdown.selectOption({ value: monthValue });
  }

  /**
   * Fills the 'Enter Previous Read:' input field.
   * @param value The text value to enter.
   */
  async fillPreviousRead(value: string): Promise<void> {
    await this.previousReadInputField.fill(value);
  }

  /**
   * Fills the 'Enter Current Read:' input field.
   * @param value The text value to enter.
   */
  async fillCurrentRead(value: string): Promise<void> {
    await this.currentReadInputField.fill(value);
  }

  /**
   * Selects the 'Electric only' service type radio button.
   */
  async selectElectricOnlyService(): Promise<void> {
    await this.electricOnlyServiceRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type radio button.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasServiceRadio.click();
  }

  /**
   * Checks if the 'Enter Previous Read:' field is visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isPreviousReadFieldVisible(): Promise<boolean> {
    return await this.previousReadInputField.isVisible();
  }

  /**
   * Checks if the 'Enter Current Read:' field is visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isCurrentReadFieldVisible(): Promise<boolean> {
    return await this.currentReadInputField.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' field is visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isEstimatedGasUseFieldVisible(): Promise<boolean> {
    return await this.estimatedGasUseField.isVisible();
  }

  /**
   * Checks if the 'Estimated Gas use (Ccf):' field is enabled.
   * @returns A promise that resolves to true if enabled, false otherwise.
   */
  async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
    return await this.estimatedGasUseField.isEnabled();
  }
}
