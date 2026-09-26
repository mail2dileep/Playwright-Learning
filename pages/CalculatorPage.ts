import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator; // Declared for state verification
    private readonly electricServiceRadio: Locator;
    private readonly electricAndGasServiceRadio: Locator;
    private readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators based on recommendedLocator from catalog
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // For disabled check
        this.electricServiceRadio = page.locator('#e');
        this.electricAndGasServiceRadio = page.locator('#eg');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Navigates to the calculator page.
     * @param url The URL of the calculator page.
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Selects a billing month from the dropdown.
     * @param monthValue The value of the month to select (e.g., 'm07' for July).
     */
    async selectBillingMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters the previous meter read value.
     * @param read The previous meter read as a string.
     */
    async enterPreviousMeterRead(read: string): Promise<void> {
        await this.previousReadInput.fill(read);
    }

    /**
     * Enters the current meter read value.
     * @param read The current meter read as a string.
     */
    async enterCurrentMeterRead(read: string): Promise<void> {
        await this.currentReadInput.fill(read);
    }

    /**
     * Selects the service type (Electric or Electric And Gas).
     * @param type The service type to select ('Electric' or 'ElectricAndGas').
     */
    async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
        if (type === 'Electric') {
            await this.electricServiceRadio.check();
        } else if (type === 'ElectricAndGas') {
            await this.electricAndGasServiceRadio.check();
        } else {
            throw new Error(`Invalid service type: ${type}`);
        }
    }

    /**
     * Clicks the Calculate button.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Retrieves the estimated electric use value.
     * @returns A promise that resolves to the estimated electric use as a string, or null if not found.
     */
    async getEstimatedElectricUse(): Promise<string | null> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Checks if the Estimated Gas use input is disabled.
     * @returns A promise that resolves to true if the input is disabled, false otherwise.
     */
    async isEstimatedGasUseInputDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }

    /**
     * Retrieves the current selected month value.
     * @returns A promise that resolves to the current selected month value (e.g., 'm06').
     */
    async getCurrentSelectedMonth(): Promise<string | null> {
        return await this.monthDropdown.inputValue();
    }
}