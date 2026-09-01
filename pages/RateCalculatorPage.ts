import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadioButton: Locator;
    private readonly electricGasServiceRadioButton: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;
    private readonly resetButton: Locator;
    private readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators derived from Locator Catalog with recommendedLocator
        this.monthDropdown = this.page.getByLabel('Month');
        this.previousReadInput = this.page.getByLabel('Enter Previous Read:');
        this.currentReadInput = this.page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceRadioButton = this.page.locator('#e');
        this.electricGasServiceRadioButton = this.page.locator('#eg');
        this.howToReadYourBillButton = this.page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = this.page.locator('#howToFindUsageBtn');
        this.resetButton = this.page.locator('#rateCalCancelBtn');
        this.calculateButton = this.page.locator('#validateMoveInBtn');
    }

    /**
     * Navigates to the rate calculator page.
     * Assumes the base URL is configured in Playwright config, and '/rate-calculator' is the path.
     */
    async navigateTo(): Promise<void> {
        await this.page.goto('/rate-calculator');
    }

    /**
     * Selects a billing month from the dropdown.
     * @param monthValue The value of the month to select (e.g., 'm10' for October).
     */
    async selectBillingMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters the previous meter read value.
     * @param read The previous meter read as a string.
     */
    async enterPreviousRead(read: string): Promise<void> {
        await this.previousReadInput.fill(read);
    }

    /**
     * Enters the current meter read value.
     * @param read The current meter read as a string.
     */
    async enterCurrentRead(read: string): Promise<void> {
        await this.currentReadInput.fill(read);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectServiceTypeElectric(): Promise<void> {
        await this.electricServiceRadioButton.check();
    }

    /**
     * Selects the 'Electric & Gas' service type radio button.
     * Note: This field may enable gas consumption calculation.
     */
    async selectServiceTypeElectricAndGas(): Promise<void> {
        await this.electricGasServiceRadioButton.check();
    }

    /**
     * Clicks the 'Calculate' button to compute estimated usage.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button to clear the form.
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Retrieves the estimated electric use (kWh) from the display field.
     * @returns The estimated electric use as a string.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the estimated gas use (Ccf) from the display field.
     * Note: This field is disabled by default based on the locator catalog.
     * @returns The estimated gas use as a string.
     */
    async getEstimatedGasUse(): Promise<string> {
        return await this.estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use field is disabled.
     * @returns True if the field is disabled, false otherwise.
     */
    async isEstimatedGasUseDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }
}
