import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator; // This field is disabled based on catalog
  private readonly serviceTypeElectricRadio: Locator;
  private readonly serviceTypeElectricGasRadio: Locator;
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
    this.serviceTypeElectricRadio = page.locator('#e');
    this.serviceTypeElectricGasRadio = page.locator('#eg');
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
   * Checks if the main rate calculator section is visible.
   * Assumes visibility of a key element (e.g., Calculate button) indicates section visibility.
   */
  async isRateCalculatorSectionVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }

  /**
   * Checks if the Month dropdown is visible.
   */
  async isMonthDropdownVisible(): Promise<boolean> {
    return await this.monthDropdown.isVisible();
  }

  /**
   * Checks if the "Enter Previous Read" field is visible.
   */
  async isPreviousReadFieldVisible(): Promise<boolean> {
    return await this.previousReadInput.isVisible();
  }

  /**
   * Checks if the "Enter Current Read" field is visible.
   */
  async isCurrentReadFieldVisible(): Promise<boolean> {
    return await this.currentReadInput.isVisible();
  }

  /**
   * Checks if the "Estimated Electric use (kWh)" field is visible.
   */
  async isEstimatedElectricUseFieldVisible(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isVisible();
  }

  /**
   * Checks if the "Estimated Gas use (Ccf)" field is visible.
   */
  async isEstimatedGasUseFieldVisible(): Promise<boolean> {
    return await this.estimatedGasUseInput.isVisible();
  }

  /**
   * Checks if the Electric Service Type radio button is visible.
   */
  async isServiceTypeElectricRadioVisible(): Promise<boolean> {
    return await this.serviceTypeElectricRadio.isVisible();
  }

  /**
   * Checks if the Electric Gas Service Type radio button is visible.
   */
  async isServiceTypeElectricGasRadioVisible(): Promise<boolean> {
    return await this.serviceTypeElectricGasRadio.isVisible();
  }

  /**
   * Checks if the Calculate button is visible.
   */
  async isCalculateButtonVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }

  /**
   * Checks if the Reset button is visible.
   */
  async isResetButtonVisible(): Promise<boolean> {
    return await this.resetButton.isVisible();
  }

  /**
   * Checks if the "Estimated Gas use (Ccf)" field is disabled.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return !(await this.estimatedGasUseInput.isEnabled());
  }

  /**
   * Gets the current value of the Month dropdown.
   */
  async getMonthDropdownCurrentValue(): Promise<string | null> {
      return await this.monthDropdown.inputValue();
  }

  /**
   * Gets the current value of the "Enter Previous Read" field.
   */
  async getPreviousReadFieldValue(): Promise<string> {
      return await this.previousReadInput.inputValue();
  }

  /**
   * Gets the current value of the "Enter Current Read" field.
   */
  async getCurrentReadFieldValue(): Promise<string> {
      return await this.currentReadInput.inputValue();
  }

  /**
   * Gets the current value of the "Estimated Electric use (kWh)" field.
   */
  async getEstimatedElectricUseFieldValue(): Promise<string> {
      return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the Electric Service Type radio button is selected.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
      return await this.serviceTypeElectricRadio.isChecked();
  }

  /**
   * Checks if the Electric Gas Service Type radio button is selected.
   */
  async isElectricGasServiceTypeSelected(): Promise<boolean> {
      return await this.serviceTypeElectricGasRadio.isChecked();
  }
}