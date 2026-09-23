import { Page, Locator } from "@playwright/test";

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly _monthSelect: Locator;
    private readonly _previousReadInput: Locator;
    private readonly _currentReadInput: Locator;
    private readonly _estimatedElectricUseInput: Locator;
    private readonly _estimatedGasUseInput: Locator;
    private readonly _electricServiceRadio: Locator;
    private readonly _electricGasServiceRadio: Locator;
    private readonly _howToReadYourBillButton: Locator;
    private readonly _howToFindUsageButton: Locator;
    private readonly _resetButton: Locator;
    private readonly _calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this._monthSelect = page.getByLabel('Month');
        this._previousReadInput = page.getByLabel('Enter Previous Read:');
        this._currentReadInput = page.getByLabel('Enter Current Read:');
        this._estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this._estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this._electricServiceRadio = page.locator('#e');
        this._electricGasServiceRadio = page.locator('#eg');
        this._howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this._howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this._resetButton = page.locator('#rateCalCancelBtn');
        this._calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Selects a month from the dropdown.
     * @param monthValue The value attribute of the month option (e.g., 'm07' for July).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this._monthSelect.selectOption(monthValue);
    }

    /**
     * Enters the previous meter reading.
     * @param value The previous read value.
     */
    async enterPreviousRead(value: string): Promise<void> {
        await this._previousReadInput.fill(value);
    }

    /**
     * Enters the current meter reading.
     * @param value The current read value.
     */
    async enterCurrentRead(value: string): Promise<void> {
        await this._currentReadInput.fill(value);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectServiceTypeElectric(): Promise<void> {
        await this._electricServiceRadio.check();
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     */
    async selectServiceTypeElectricGas(): Promise<void> {
        await this._electricGasServiceRadio.check();
    }

    /**
     * Clicks the 'How to Read Your Bill' button.
     */
    async clickHowToReadYourBill(): Promise<void> {
        await this._howToReadYourBillButton.click();
    }

    /**
     * Clicks the 'How to Find Usage' button.
     */
    async clickHowToFindUsage(): Promise<void> {
        await this._howToFindUsageButton.click();
    }

    /**
     * Clicks the 'Reset' button to clear calculator fields.
     */
    async clickReset(): Promise<void> {
        await this._resetButton.click();
    }

    /**
     * Clicks the 'Calculate' button to compute usage.
     */
    async clickCalculate(): Promise<void> {
        await this._calculateButton.click();
    }

    /**
     * Retrieves the estimated electric use value from the input field.
     * @returns The estimated electric use as a string, or null if not found.
     */
    async getEstimatedElectricUseValue(): Promise<string | null> {
        return this._estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the estimated gas use value from the input field.
     * This field is typically disabled, but its value can still be read.
     * @returns The estimated gas use as a string, or null if not found.
     */
    async getEstimatedGasUseValue(): Promise<string | null> {
        return this._estimatedGasUseInput.inputValue();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if the field is disabled, false otherwise.
     */
    async isEstimatedGasUseInputDisabled(): Promise<boolean> {
        return await this._estimatedGasUseInput.isDisabled();
    }

    /**
     * Retrieves the currently selected month's value from the dropdown.
     * @returns The value attribute of the selected month, or null if not found.
     */
    async getSelectedMonth(): Promise<string | null> {
        return this._monthSelect.inputValue();
    }

    /**
     * Retrieves the current value of the previous read input field.
     * @returns The value of the previous read field.
     */
    async getPreviousReadValue(): Promise<string | null> {
        return this._previousReadInput.inputValue();
    }

    /**
     * Retrieves the current value of the current read input field.
     * @returns The value of the current read field.
     */
    async getCurrentReadValue(): Promise<string | null> {
        return this._currentReadInput.inputValue();
    }
}
