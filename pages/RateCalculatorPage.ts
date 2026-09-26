import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator; // This element is disabled
    private readonly electricServiceRadio: Locator;
    private readonly electricGasServiceRadio: Locator;
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceRadio = page.locator('#e'); // Recommended locator from catalog
        this.electricGasServiceRadio = page.locator('#eg'); // Recommended locator from catalog
        this.calculateButton = page.locator('#validateMoveInBtn'); // Recommended locator from catalog
        this.resetButton = page.locator('#rateCalCancelBtn'); // Recommended locator from catalog
    }

    /**
     * Navigates to the rate calculator page.
     * @param url The URL of the rate calculator page.
     */
    async navigate(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption({ value: monthValue });
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
    async selectElectricService(): Promise<void> {
        await this.electricServiceRadio.click();
    }

    /**
     * Selects the 'Electric & Gas' service type radio button.
     */
    async selectElectricGasService(): Promise<void> {
        if (await this.electricGasServiceRadio.isEnabled()) {
            await this.electricGasServiceRadio.click();
        } else {
            console.warn('Attempted to click on a disabled Electric & Gas service radio button.');
        }
    }

    /**
     * Clicks the 'Calculate' button to compute usage.
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
     * Retrieves the estimated electric use value.
     * @returns The estimated electric use as a string.
     */
    async getEstimatedElectricUse(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if the field is disabled, false otherwise.
     */
    async isEstimatedGasUseDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }
}