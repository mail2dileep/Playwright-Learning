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
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators must only use recommendedLocator from the catalog
        this.monthSelect = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // disabled: true, but its value can be read
        this.electricServiceRadio = page.locator('#e');
        this.electricGasServiceRadio = page.locator('#eg');
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
    }

    /**
     * Navigates to the rate calculator page.
     * Assumes a base URL is configured in Playwright config or provided.
     * @param url Optional URL path to navigate to, relative to base URL.
     */
    async navigate(url: string = '/rate-calculator'): Promise<void> {
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
     * Enters the previous meter read value.
     * @param readValue The previous meter read as a string.
     */
    async enterPreviousRead(readValue: string): Promise<void> {
        await this.previousReadInput.fill(readValue);
    }

    /**
     * Enters the current meter read value.
     * @param readValue The current meter read as a string.
     */
    async enterCurrentRead(readValue: string): Promise<void> {
        await this.currentReadInput.fill(readValue);
    }

    /**
     * Selects the Electric only service type radio button.
     */
    async selectElectricServiceType(): Promise<void> {
        await this.electricServiceRadio.check();
    }

    /**
     * Selects the Electric and Gas service type radio button.
     */
    async selectElectricAndGasServiceType(): Promise<void> {
        await this.electricGasServiceRadio.check();
    }

    /**
     * Clicks the Calculate button.
     */
    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the Reset button.
     */
    async clickResetButton(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Gets the estimated electric use (kWh) value.
     * @returns The estimated electric use as a string.
     */
    async getEstimatedElectricUse(): Promise<string | null> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Gets the estimated gas use (Ccf) value.
     * Note: This field is disabled, but its value can still be read for verification.
     * @returns The estimated gas use as a string.
     */
    async getEstimatedGasUse(): Promise<string | null> {
        return await this.estimatedGasUseInput.inputValue();
    }

    /**
     * Verifies if the estimated gas use field is disabled.
     * @returns True if disabled, false otherwise.
     */
    async isEstimatedGasUseFieldDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }

    /**
     * Gets the value of the previous meter read input field.
     * @returns The value of the previous meter read input as a string.
     */
    async getPreviousReadValue(): Promise<string | null> {
        return await this.previousReadInput.inputValue();
    }

    /**
     * Gets the value of the current meter read input field.
     * @returns The value of the current meter read input as a string.
     */
    async getCurrentReadValue(): Promise<string | null> {
        return await this.currentReadInput.inputValue();
    }

    /**
     * Gets the currently selected month value.
     * @returns The value attribute of the selected option as a string.
     */
    async getSelectedMonthValue(): Promise<string | null> {
        // The 'value' property of a select element holds the value of the selected option.
        return await this.monthSelect.evaluate((select: HTMLSelectElement) => select.value);
    }

    /**
     * Checks if the Electric service type radio button is selected.
     * @returns True if selected, false otherwise.
     */
    async isElectricServiceSelected(): Promise<boolean> {
        return await this.electricServiceRadio.isChecked();
    }

    /**
     * Checks if the Electric and Gas service type radio button is selected.
     * @returns True if selected, false otherwise.
     */
    async isElectricAndGasServiceSelected(): Promise<boolean> {
        return await this.electricGasServiceRadio.isChecked();
    }
}