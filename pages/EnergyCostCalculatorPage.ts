import { Page, Locator, expect } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricServiceTypeRadio: Locator;
  private readonly electricGasServiceTypeRadio: Locator;
  private readonly calculateButton: Locator;

  constructor(private page: Page) {
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricServiceTypeRadio = page.locator('#e');
    this.electricGasServiceTypeRadio = page.locator('#eg');
    this.calculateButton = page.locator('#validateMoveInBtn');
  }

  /**
   * Navigates to the Energy Cost Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateToCalculatorPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the rate calculator section is visible by checking a key element.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isCalculatorSectionVisible(): Promise<boolean> {
    return await this.calculateButton.isVisible();
  }

  /**
   * Retrieves the default selected value of the month dropdown.
   * @returns A promise that resolves to the selected month value.
   */
  async getMonthDefaultValue(): Promise<string | null> {
    return await this.monthDropdown.inputValue();
  }

  /**
   * Retrieves the default value of the previous meter read input field.
   * @returns A promise that resolves to the input field's value.
   */
  async getPreviousReadDefaultValue(): Promise<string> {
    return await this.previousReadInput.inputValue();
  }

  /**
   * Retrieves the default value of the current meter read input field.
   * @returns A promise that resolves to the input field's value.
   */
  async getCurrentReadDefaultValue(): Promise<string> {
    return await this.currentReadInput.inputValue();
  }

  /**
   * Retrieves the default value of the estimated electric use input field.
   * @returns A promise that resolves to the input field's value.
   */
  async getEstimatedElectricUseDefaultValue(): Promise<string> {
    return await this.estimatedElectricUseInput.inputValue();
  }

  /**
   * Checks if the estimated gas use field is disabled.
   * @returns A promise that resolves to true if disabled, false otherwise.
   */
  async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
    return await this.estimatedGasUseInput.isDisabled();
  }

  /**
   * Checks if the 'Electric' service type radio button is selected.
   * @returns A promise that resolves to true if selected, false otherwise.
   */
  async isElectricServiceTypeSelected(): Promise<boolean> {
    return await this.electricServiceTypeRadio.isChecked();
  }

  /**
   * Checks if the month dropdown is present and visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isMonthDropdownPresent(): Promise<boolean> {
    return await this.monthDropdown.isVisible();
  }

  /**
   * Checks if the previous read input field is present and visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isPreviousReadFieldPresent(): Promise<boolean> {
    return await this.previousReadInput.isVisible();
  }

  /**
   * Checks if the current read input field is present and visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isCurrentReadFieldPresent(): Promise<boolean> {
    return await this.currentReadInput.isVisible();
  }

  /**
   * Checks if the estimated electric use input field is present and visible.
   * @returns A promise that resolves to true if visible, false otherwise.
   */
  async isEstimatedElectricUseFieldPresent(): Promise<boolean> {
    return await this.estimatedElectricUseInput.isVisible();
  }
}
