import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    readonly page: Page;
    readonly electricOnlyRadio: Locator;
    readonly electricAndGasRadio: Locator;
    readonly electricMeterInput: Locator;
    readonly gasMeterInput: Locator;
    readonly monthDropdown: Locator;
    readonly calculateButton: Locator;
    readonly resetButton: Locator;
    readonly readBillLink: Locator;
    readonly findUsageLink: Locator;
    readonly totalPriceDisplay: Locator;

    constructor(page: Page) {
        this.page = page;
        this.electricOnlyRadio = page.getByLabel('Electric Only');
        this.electricAndGasRadio = page.getByLabel('Electric and Gas');
        this.electricMeterInput = page.getByLabel('Electric Meter Read');
        this.gasMeterInput = page.getByLabel('Gas Meter Read');
        this.monthDropdown = page.getByLabel('Select Month');
        this.calculateButton = page.getByRole('button', { name: 'Calculate' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.readBillLink = page.getByRole('link', { name: 'How to read your bill' });
        this.findUsageLink = page.getByRole('link', { name: 'How to find Usage' });
        this.totalPriceDisplay = page.locator('calculator_current').getByText('Total');
    }

    async selectElectricOnly(): Promise<void> {
        await this.electricOnlyRadio.check();
    }

    async selectElectricAndGas(): Promise<void> {
        await this.electricAndGasRadio.check();
    }

    async enterElectricRead(value: string): Promise<void> {
        await this.electricMeterInput.fill(value);
    }

    async enterGasRead(value: string): Promise<void> {
        await this.gasMeterInput.fill(value);
    }

    async selectMonth(month: string): Promise<void> {
        await this.monthDropdown.selectOption(month);
    }

    async calculateBill(): Promise<void> {
        await this.calculateButton.click();
    }

    async resetCalculator(): Promise<void> {
        await this.resetButton.click();
    }

    async clickHowToReadBill(): Promise<void> {
        await this.readBillLink.click();
    }

    async clickHowToFindUsage(): Promise<void> {
        await this.findUsageLink.click();
    }
}