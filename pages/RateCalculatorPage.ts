import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;

    // Locators
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricOnlyRadio: Locator;
    private readonly electricAndGasRadio: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;
    private readonly resetButton: Locator;
    private readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators based on recommendedLocator from catalog
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricOnlyRadio = page.locator('#e');
        this.electricAndGasRadio = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Selects a month from the month dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm06' for June).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters a value into the 'Enter Previous Read' field.
     * @param value The numeric value to enter.
     */
    async enterPreviousRead(value: string): Promise<void> {
        await this.previousReadInput.fill(value);
    }

    /**
     * Enters a value into the 'Enter Current Read' field.
     * @param value The numeric value to enter.
     */
    async enterCurrentRead(value: string): Promise<void> {
        await this.currentReadInput.fill(value);
    }

    /**
     * Enters a value into the 'Estimated Electric use (kWh)' field.
     * This field is typically calculated but can be directly entered for certain scenarios.
     * @param value The numeric value to enter.
     */
    async enterEstimatedElectricUse(value: string): Promise<void> {
        await this.estimatedElectricUseInput.fill(value);
    }

    /**
     * Selects the 'Electric only' service type radio button.
     */
    async selectElectricOnlyServiceType(): Promise<void> {
        await this.electricOnlyRadio.click();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */    async selectElectricAndGasServiceType(): Promise<void> {
        await this.electricAndGasRadio.click();
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
    async clickResetButton(): Promise<void> {
        await this.resetButton.click();
    }

    /**
     * Clicks the 'Calculate' button to submit the form and view results.
     */
    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Returns the Locator for the 'Estimated Electric use (kWh)' input field.
     * This can be used in test specs for assertions (e.g., toBeEnabled, toHaveValue).
     */
    getEstimatedElectricUseInput(): Locator {
        return this.estimatedElectricUseInput;
    }

    /**
     * Returns the Locator for the 'Estimated Gas use (Ccf)' input field.
     * This can be used in test specs for assertions (e.g., toBeDisabled).
     */
    getEstimatedGasUseInput(): Locator {
        return this.estimatedGasUseInput;
    }
}