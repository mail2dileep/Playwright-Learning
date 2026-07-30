import { Page, Locator, expect } from '@playwright/test';

export class RateCalculatorPage {
  private readonly page: Page;

  // Locators for the public-facing Rate Calculator (calculator_current)
  private readonly monthDropdown: Locator;
  private readonly previousReadInput: Locator;
  private readonly currentReadInput: Locator;
  private readonly electricServiceRadio: Locator;
  private readonly electricGasServiceRadio: Locator;
  private readonly calculateButton: Locator;
  private readonly estimatedElectricUseDisplay: Locator;
  private readonly estimatedGasUseDisplay: Locator; // Disabled by default, for display/assertion only

  constructor(page: Page) {
    this.page = page;
    this.monthDropdown = page.getByLabel('Month');
    this.previousReadInput = page.getByLabel('Enter Previous Read:');
    this.currentReadInput = page.getByLabel('Enter Current Read:');
    this.electricServiceRadio = page.locator('#e'); // Recommended Locator: locator('#e')
    this.electricGasServiceRadio = page.locator('#eg'); // Recommended Locator: locator('#eg')
    this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended Locator: locator('#validateMoveInBtn')
    this.estimatedElectricUseDisplay = page.getByLabel('Estimated Electric use (kWh):');
    this.estimatedGasUseDisplay = page.getByLabel('Estimated Gas use (Ccf):');
  }

  // --- AEM Authoring Actions (Locators not found in catalog, marked as TODO) ---
  // The provided Locator Catalog only contains elements within 'calculator_current'.
  // AEM authoring elements are outside this scope, hence they are marked as TODO.

  async navigateToAEMAuthoring(aemAuthorUrl: string): Promise<void> {
    // TODO: Locator not found in catalog for AEM Authoring URL navigation.
    // This action navigates to the AEM author instance.
    await this.page.goto(aemAuthorUrl);
  }

  async loginToAEM(username: string, password: string): Promise<void> {
    // TODO: Locator not found in catalog for AEM login fields (username, password, login button).
    // This method would typically interact with AEM login elements.
    console.log(`Attempting to login to AEM with username: ${username}. Locators are not in catalog.`);
    // Example (if locators were available):
    // await this.page.fill('input[name="j_username"]', username);
    // await this.page.fill('input[name="j_password"]', password);
    // await this.page.click('button[type="submit"]');
  }

  async openRateCalculatorComponentProperties(): Promise<void> {
    // TODO: Locator not found in catalog for navigating to/opening Rate Calculator component properties in AEM.
    // This involves clicks on AEM UI elements (e.g., page editor, component toolbar, configure button).
    console.log('Attempting to open Rate Calculator component properties in AEM. Locators are not in catalog.');
    // Example (if locators were available):
    // await this.page.click('button[title="Configure"]');
  }

  async setElectricFuelPricingInAEM(price: string): Promise<void> {
    // TODO: Locator not found in catalog for 'Electric fuel' pricing field in AEM component properties dialog.
    // This method would fill an input field within the AEM component configuration.
    console.log(`Setting Electric fuel pricing to ${price} in AEM component properties. Locators are not in catalog.`);
    // Example (if locators were available):
    // await this.page.fill('input[aria-label="Electric Fuel Price"]', price);
  }

  async setGasFuelPricingInAEM(price: string): Promise<void> {
    // TODO: Locator not found in catalog for 'Gas fuel' pricing field in AEM component properties dialog.
    // This method would fill an input field within the AEM component configuration.
    console.log(`Setting Gas fuel pricing to ${price} in AEM component properties. Locators are not in catalog.`);
    // Example (if locators were available):
    // await this.page.fill('input[aria-label="Gas Fuel Price"]', price);
  }

  async saveAEMComponentProperties(): Promise<void> {
    // TODO: Locator not found in catalog for 'Save' button in AEM component properties dialog.
    // This action would click the save button within the AEM dialog.
    console.log('Saving AEM component properties. Locators are not in catalog.');
    // Example (if locators were available):
    // await this.page.click('button[title="Done"]');
  }

  async publishPage(): Promise<void> {
    // TODO: Locator not found in catalog for 'Publish Page' button/action in AEM.
    // This action involves interacting with AEM page publishing controls.
    console.log('Publishing the page in AEM. Locators are not in catalog.');
    // Example (if locators were available):
    // await this.page.click('button[title="Publish Page"]');
  }

  // --- Public-facing Rate Calculator Actions ---

  async navigateToLiveRateCalculator(liveUrl: string): Promise<void> {
    // This action navigates to the live public-facing rate calculator page.
    await this.page.goto(liveUrl);
  }

  async selectBillingMonth(monthValue: string): Promise<void> {
    // Selects an option from the month dropdown using its value.
    await this.monthDropdown.selectOption(monthValue);
  }

  async enterPreviousRead(value: string): Promise<void> {
    // Fills the 'Enter Previous Read' input field.
    await this.previousReadInput.fill(value);
  }

  async enterCurrentRead(value: string): Promise<void> {
    // Fills the 'Enter Current Read' input field.
    await this.currentReadInput.fill(value);
  }

  async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
    // Selects the specified service type radio button.
    if (type === 'Electric') {
      await this.electricServiceRadio.click();
    } else if (type === 'ElectricAndGas') {
      await this.electricGasServiceRadio.click();
    } else {
      throw new Error(`Invalid service type: ${type}`);
    }
  }

  async clickCalculate(): Promise<void> {
    // Clicks the 'Calculate' button.
    await this.calculateButton.click();
  }

  async getEstimatedElectricUse(): Promise<string | null> {
    // Retrieves the value from the 'Estimated Electric use (kWh)' display field.
    // Returns null if the element does not have an input value property or is not found.
    return this.estimatedElectricUseDisplay.inputValue();
  }

  async getEstimatedGasUse(): Promise<string | null> {
    // Retrieves the value from the 'Estimated Gas use (Ccf)' display field.
    // Note: This field is disabled by default, but its value might be updated by the calculation.
    // Returns null if the element does not have an input value property or is not found.
    return this.estimatedGasUseDisplay.inputValue();
  }

  // TODO: Add methods to assert calculated values if a locator for the final result display becomes available.
  // The current Locator Catalog provides inputs and 'estimated usage' fields, but no explicit 'total bill amount' or 'rate applied' display.
}
