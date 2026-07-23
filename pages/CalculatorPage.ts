import { Page, Locator, expect } from '@playwright/test';

export class CalculatorPage {
    private readonly page: Page;
    private readonly serviceTypeEGInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locators based on the provided catalog and recommended locators
        this.serviceTypeEGInput = this.page.locator('#eg'); // 'Electric and Gas' radio button
        this.estimatedElectricUseInput = this.page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = this.page.getByLabel('Estimated Gas use (Ccf):');
        this.calculateButton = this.page.locator('#validateMoveInBtn');
    }

    /**
     * Selects the 'Electric and Gas' service type option.
     */
    async selectElectricAndGasServiceType(): Promise<void> {
        await this.serviceTypeEGInput.click();
    }

    /**
     * Enters the estimated electric usage (kWh) into the corresponding field.
     * @param kwh The estimated electric usage in kWh.
     */
    async enterEstimatedElectricUse(kwh: string): Promise<void> {
        await this.estimatedElectricUseInput.fill(kwh);
    }

    /**
     * Enters the estimated gas usage (Ccf) into the corresponding field.
     * Assumes this field becomes enabled after selecting the 'Electric and Gas' service type.
     * @param ccf The estimated gas usage in Ccf.
     */
    async enterEstimatedGasUse(ccf: string): Promise<void> {
        // It's good practice to wait for it to be enabled if it starts disabled
        await expect(this.estimatedGasUseInput).toBeEnabled();
        await this.estimatedGasUseInput.fill(ccf);
    }

    /**
     * Clicks the 'Calculate' button to compute the rates.
     */
    async clickCalculateButton(): Promise<void> {
        await this.calculateButton.click();
    }

    /**
     * Checks if the 'Estimated Gas use (Ccf):' field is enabled.
     * @returns A Promise that resolves to true if the field is enabled, false otherwise.
     */
    async isEstimatedGasUseFieldEnabled(): Promise<boolean> {
        return await this.estimatedGasUseInput.isEnabled();
    }

    /**
     * Retrieves the current value from the 'Estimated Electric use (kWh):' field.
     * @returns A Promise that resolves to the input value string.
     */
    async getEstimatedElectricUseValue(): Promise<string> {
        return await this.estimatedElectricUseInput.inputValue();
    }

    /**
     * Retrieves the current value from the 'Estimated Gas use (Ccf):' field.
     * @returns A Promise that resolves to the input value string.
     */
    async getEstimatedGasUseValue(): Promise<string> {
        return await this.estimatedGasUseInput.inputValue();
    }
}