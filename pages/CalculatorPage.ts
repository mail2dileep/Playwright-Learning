import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
    private readonly page: Page;
    private readonly monthSelect: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricGasServiceRadio: Locator;
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators based on recommendedLocator from catalog
        this.monthSelect = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceRadio = page.locator('#e');
        this.electricGasServiceRadio = page.locator('#eg');
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
    }

    /**
     * Navigates to the calculator page.
     * @param url The URL of the calculator page.
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthSelect.selectOption(monthValue);
    }

    /**
     * Enters the previous meter reading.
     * @param readValue The previous meter reading value.
     */
    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    /**
     * Enters the current meter reading.
     * @param readValue The current meter reading value.
     */
    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectElectricService(): Promise<void> {
        await this.electricServiceRadio.check();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */
    async selectElectricAndGasService(): Promise<void> {
        await this.electricGasServiceRadio.check();
    }

    /**
     * Clicks the 'Calculate' button.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button.
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Gets the estimated electric use value.
     * @returns The string value of the estimated electric use.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Gets the estimated gas use value.
     * @returns The string value of the estimated gas use.
     */
    async getEstimatedGasUse(): Promise<string> {
        return await this.estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if disabled, false otherwise.
     */
    async isEstimatedGasUseDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }
}
