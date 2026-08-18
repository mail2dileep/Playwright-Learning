import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
    readonly page: Page;
    private readonly electricAndGasServiceTypeRadioButton: Locator;
    private readonly previousElectricMeterReadInput: Locator;
    private readonly currentElectricMeterReadInput: Locator;
    private readonly estimatedGasUseInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.electricAndGasServiceTypeRadioButton = page.locator('#eg');
        this.previousElectricMeterReadInput = page.getByLabel('Enter Previous Read:');
        this.currentElectricMeterReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
    }

    /**
     * Selects the 'Electric and Gas' service type radio button.
     * @returns Promise<void>
     */
    async selectServiceTypeElectricAndGas(): Promise<void> {
        await this.electricAndGasServiceTypeRadioButton.click();
    }

    /**
     * Gets the locator for the 'Enter Previous Read' electric meter field.
     * @returns Locator
     */
    getPreviousElectricMeterReadField(): Locator {
        return this.previousElectricMeterReadInput;
    }

    /**
     * Gets the locator for the 'Enter Current Read' electric meter field.
     * @returns Locator
     */
    getCurrentElectricMeterReadField(): Locator {
        return this.currentElectricMeterReadInput;
    }

    /**
     * Gets the locator for the 'Estimated Gas use (Ccf)' field.
     * @returns Locator
     */
    getEstimatedGasUseField(): Locator {
        return this.estimatedGasUseInput;
    }
}