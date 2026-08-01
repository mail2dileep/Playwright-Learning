import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    private readonly monthDropdown: Locator;
    private readonly previousMeterReadInput: Locator;
    private readonly currentMeterReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricOnlyRadio: Locator;
    private readonly electricAndGasRadio: Locator;
    private readonly calculateButton: Locator;
    private readonly resetButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.monthDropdown = page.getByLabel('Month');
        this.previousMeterReadInput = page.getByLabel('Enter Previous Read:');
        this.currentMeterReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):'); // Disabled by default
        this.electricOnlyRadio = page.locator('#e');
        this.electricAndGasRadio = page.locator('#eg');
        this.calculateButton = page.locator('#validateMoveInBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
    }

    /**
     * Selects the 'Electric only' service type radio button.
     */
    async selectServiceTypeElectricOnly(): Promise<void> {
        await this.electricOnlyRadio.click();
    }

    /**
     * Enters the estimated electric usage in kWh.
     * @param kwh The estimated electric usage value.
     */
    async enterEstimatedElectricUsage(kwh: string): Promise<void> {
        await this.estimatedElectricUseInput.fill(kwh);
    }

    /**
     * Clicks the 'Calculate' button to perform the calculation.
     */
    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Checks if the estimated electric use input field is enabled.
     * @returns True if the field is enabled, false otherwise.
     */
    async isEstimatedElectricUseInputEnabled(): Promise<boolean> {
        return await this.estimatedElectricUseInput.isEnabled();
    }

    /**
     * Checks if the estimated gas use input field is disabled.
     * @returns True if the field is disabled, false otherwise.
     */
    async isEstimatedGasUseInputDisabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isDisabled();
    }

    /**
     * Retrieves the current value from the estimated electric use input field.
     * @returns The value of the estimated electric use input field.
     */
    async getEstimatedElectricUsageValue(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    // TODO: Add methods to get calculated price or other output fields when locators are available.
}
