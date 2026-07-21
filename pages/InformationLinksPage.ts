import { Page, Locator } from '@playwright/test';

export class InformationLinksPage {
    private readonly howToReadBillLink: Locator;
    private readonly howToFindUsageLink: Locator;

    constructor(private page: Page) {
        this.howToReadBillLink = this.page.locator('#howToReadYourBillBtn');
        this.howToFindUsageLink = this.page.locator('#howToFindUsageBtn');
    }

    /**
     * Clicks the 'How to Read Your Bill' button and waits for a new page/tab to open.
     * @returns A Promise that resolves to the new Page object that opened.
     */
    async clickHowToReadYourBillLink(): Promise<Page> {
        // Use page.waitForEvent('popup') to handle new tabs or windows that open after a click.
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'), 
            this.howToReadBillLink.click(),
        ]);
        return newPage;
    }

    /**
     * Clicks the 'How to Find Usage' button and waits for a new page/tab to open.
     * @returns A Promise that resolves to the new Page object that opened.
     */
    async clickHowToFindUsageLink(): Promise<Page> {
        // Use page.waitForEvent('popup') to handle new tabs or windows that open after a click.
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'), 
            this.howToFindUsageLink.click(),
        ]);
        return newPage;
    }
}
