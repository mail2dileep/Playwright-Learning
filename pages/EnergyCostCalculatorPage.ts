import { Page, Locator } from '@playwright/test';

export class EnergyCostCalculatorPage {
  private readonly page: Page;
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly estimatedElectricUseInput: Locator;
  private readonly estimatedGasUseInput: Locator;
  private readonly electricOnlyRadio: Locator;
  private readonly electricAndGasRadio: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators based on recommendedLocator from the Locator Catalog
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    this.electricOnlyRadio = page.locator('#e'); // Recommended Locator: locator('#e')
    this.electricAndGasRadio = page.locator('#eg'); // Recommended Locator: locator('#eg')
  }

  /**
   * Navigates to the Energy Cost Calculator page.
   * @param url The URL of the calculator page.
   */
  async navigateToCalculatorPage(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Checks if the main calculator section is visible by asserting the visibility
   * of a key component within it.
   * @returns True if the calculator section is visible, false otherwise.
   */
  async isCalculatorSectionVisible(): Promise<boolean> {
    // As per rules, if the parent container itself has no recommendedLocator,
    // we assert the visibility of a primary interactive element within it.
    return this.monthDropdown.isVisible();
  }

  /**
   * Selects the 'Electric only' service type option.
   */
  async selectElectricServiceOnly(): Promise<void> {
    await this.electricOnlyRadio.click();
  }

  /**
   * Selects the 'Electric and Gas' service type option.
   */
  async selectElectricAndGasService(): Promise<void> {
    await this.electricAndGasRadio.click();
  }

  /**
   * Retrieves the enabled and visible state of the Electric Meter Read field.
   * @returns An object indicating if the field is enabled and visible.
   */
  async getElectricMeterReadState(): Promise<{ isEnabled: boolean; isVisible: boolean }> {
    const isEnabled = await this.previousReadInput.isEnabled();
    const isVisible = await this.previousReadInput.isVisible();
    return { isEnabled, isVisible };
  }

  /**
   * Retrieves the enabled and visible state of the Estimated Gas use (Ccf) field.
   * @returns An object indicating if the field is enabled and visible.
   */
  async getGasMeterReadState(): Promise<{ isEnabled: boolean; isVisible: boolean }> {
    const isEnabled = await this.estimatedGasUseInput.isEnabled();
    const isVisible = await this.estimatedGasUseInput.isVisible();
    return { isEnabled, isVisible };
  }
}
