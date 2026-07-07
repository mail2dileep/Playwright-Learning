import { test, expect, Page } from "@playwright/test";
import { InformationLinksPage } from "../pages/InformationLinksPage";

test.describe("PDF Information Links Validation", () => {
  // Assuming the application under test runs on a local server or a known URL.
  // This base URL should typically be configured in playwright.config.ts
  const BASE_URL = "/"; // Or a specific path if necessary, e.g., "/calculator"

  test("should verify 'How to read your bill' and 'How to find Usage' PDF documents open correctly", async ({ page, context }) => {
    const informationLinksPage = new InformationLinksPage(page);

    await page.goto(BASE_URL);

    await test.step("Step 1: Click on the 'How to read your bill' link and verify PDF opens", async () => {
      // Playwright can detect new pages (tabs) or downloads. This handles new page.
      // If it's a direct download without opening a new tab, use page.waitForEvent('download') instead.
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        informationLinksPage.clickHowToReadYourBillButton(),
      ]);

      await newPage.waitForLoadState();
      expect(newPage.url()).toContain(".pdf");
      // Additional assertions can be added here, e.g., to check for specific PDF filename in URL
      // expect(newPage.url()).toContain("how-to-read-your-bill.pdf");
      await newPage.close(); // Close the new tab to keep the test environment clean
    });

    await test.step("Step 2: Click on the 'How to find Usage' link and verify PDF opens", async () => {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        informationLinksPage.clickHowToFindUsageButton(),
      ]);

      await newPage.waitForLoadState();
      expect(newPage.url()).toContain(".pdf");
      // expect(newPage.url()).toContain("how-to-find-usage.pdf");
      await newPage.close();
    });
  });
});
