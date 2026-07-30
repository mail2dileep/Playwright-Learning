import { Page, Locator } from '@playwright/test';

export class RateCalculatorPage {
    private readonly page: Page;
    // Locators
    private readonly monthDropdown: Locator;
    private readonly previousReadInput: Locator;
    private readonly currentReadInput: Locator;
    private readonly estimatedElectricUseInput: Locator;
    private readonly estimatedGasUseInput: Locator;
    private readonly electricServiceRadio: Locator;
    private readonly electricGasServiceRadio: Locator;
    private readonly howToReadYourBillButton: Locator;
    private readonly howToFindUsageButton: Locator;
    private readonly resetButton: Locator;
    private readonly calculateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Initialize locators using recommendedLocator from catalog
        this.monthDropdown = page.getByLabel('Month');
        this.previousReadInput = page.getByLabel('Enter Previous Read:');
        this.currentReadInput = page.getByLabel('Enter Current Read:');
        this.estimatedElectricUseInput = page.getByLabel('Estimated Electric use (kWh):');
        this.estimatedGasUseInput = page.getByLabel('Estimated Gas use (Ccf):');
        this.electricServiceRadio = page.locator('#e');
        this.electricGasServiceRadio = page.locator('#eg');
        this.howToReadYourBillButton = page.locator('#howToReadYourBillBtn');
        this.howToFindUsageButton = page.locator('#howToFindUsageBtn');
        this.resetButton = page.locator('#rateCalCancelBtn');
        this.calculateButton = page.locator('#validateMoveInBtn');
    }

    /**
     * Navigates to the CPS Energy cost calculator page.
     * @param url The URL of the energy cost calculator page.
     */
    async navigateToCalculatorPage(url: string): Promise<void> {
        await this.page.goto(url);
    }

    /**
     * Checks if the Rate Calculator section is visible on the page.
     * This is determined by the visibility of a key interactive element within the calculator.
     * @returns A Promise that resolves to true if the calculator section is visible, false otherwise.
     */
    async isCalculatorSectionVisible(): Promise<boolean> {
        // The 'Month' dropdown is a prominent and required element for the calculator's functionality.
        // Checking its visibility serves as a good indicator for the presence of the calculator section.
        return await this.monthDropdown.isVisible();
    }

    /**
     * Selects a month from the month dropdown.
     * @param monthValue The value attribute of the option to select (e.g., 'm06' for June).
     */
    async selectMonth(monthValue: string): Promise<void> {
        await this.monthDropdown.selectOption(monthValue);
    }

    /**
     * Enters a value into the previous meter read input field.
     * @param value The previous meter read value to enter.
     */
    async enterPreviousRead(value: string): Promise<void> {
        await this.previousReadInput.fill(value);
    }

    /**
     * Enters a value into the current meter read input field.
     * @param value The current meter read value to enter.
     */
    async enterCurrentRead(value: string): Promise<void> {
        await this.currentReadInput.fill(value);
    }

    /**
     * Selects the 'Electric' service type radio button.
     */
    async selectServiceTypeElectric(): Promise<void> {
        await this.electricServiceRadio.check();
    }

    /**
     * Selects the 'Electric/Gas' service type radio button.
     */
    async selectServiceTypeElectricGas(): Promise<void> {
        await this.electricGasServiceRadio.check();
    }

    /**
     * Clicks the 'Calculate' button.
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
}
