import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricGasServiceRadio: Locator;
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;

    constructor(private page: Page) {
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // This field is disabled, its value can still be read.
        this.electricServiceRadio = page.locator('#e'); // Represents 'Electric' service type
        this.electricGasServiceRadio = page.locator('#eg'); // Represents 'Electric & Gas' service type
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
    }

    /**
     * Selects a billing month from the dropdown.
     * @param monthValue The value of the month to select (e.g., 'm07' for July).
     */
    async selectBillingMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
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
     * Selects the service type using the appropriate radio button.
     * @param type 'Electric' or 'ElectricAndGas'.
     */
    async selectServiceType(type: 'Electric' | 'ElectricAndGas'): Promise<void> {
        if (type === 'Electric') {
            await this.electricServiceRadio.check();
        } else if (type === 'ElectricAndGas') {
            await this.electricGasServiceRadio.check();
        } else {
            throw new Error(`Invalid service type specified: ${type}`);
        }
    }

    /**
     * Clicks the 'Calculate' button to compute the estimated usage.
     */
    async clickCalculate(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Clicks the 'Reset' button to clear all form fields.
     */
    async clickReset(): Promise<void> {
        await this.resetButton.click();
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
     * Retrieves the value from the 'Estimated Electric use (kWh):' input field.
     * @returns The estimated electric use as a string, or null if the input is not found or has no value.
     */
    async getEstimatedElectricUse(): Promise<string | null> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the value from the 'Estimated Gas use (Ccf):' input field.
     * This field is typically disabled, but its value can still be read.
     * @returns The estimated gas use as a string, or null if the input is not found or has no value.
     */
    async getEstimatedGasUse(): Promise<string | null> {
        return await this.estimatedGasUseInput.inputValue();
    }

    /**
     * Retrieves the current value from the 'Enter Previous Read:' input field.
     * @returns The previous read value as a string.
     */
    async getPreviousReadValue(): Promise<string> {
        return await this.previousReadInput.inputValue();
    }

    /**
     * Retrieves the current value from the 'Enter Current Read:' input field.
     * @returns The current read value as a string.
     */
    async getCurrentReadValue(): Promise<string> {
        return await this.currentReadInput.inputValue();
    }

    /**
     * Retrieves the currently selected value from the Month dropdown.
     * @returns The value of the selected month as a string.
     */
    async getMonthDropdownValue(): Promise<string> {
        return await this.monthDropdown.inputValue();
    }
}
