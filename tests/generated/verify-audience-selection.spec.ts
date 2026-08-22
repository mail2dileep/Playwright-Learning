import { test, expect } from '@playwright/test';
import { GlobalHeaderPage } from '../../pages/GlobalHeaderPage'; // Relative import

test.describe('Audience Selection in Global Header', () => {
  const testUrl = 'https://credera.atlassian.net/browse/MTX-4945';
  const audienceTypeToSelect = 'SMB Advertiser';

  test('Verify audience switcher is visible and allows selection of different audience types', async ({ page }) => {
    const globalHeaderPage = new GlobalHeaderPage(page);

    // Step 1: Navigate to the website URL.
    await test.step('Navigate to the website URL', async () => {
      await globalHeaderPage.navigateToUrl(testUrl);
      // Expected Result: Global header is visible.
      // NOTE: This assertion is expected to fail because the globalHeaderContainer locator is a 'TODO' placeholder.
      await expect(globalHeaderPage.getGlobalHeaderLocator()).toBeVisible();
    });

    // Step 2: Locate the audience switcher in the global header.
    await test.step('Locate the audience switcher in the global header', async () => {
      // Expected Result: Audience switcher is present and clickable.
      // NOTE: These assertions are expected to fail because the audienceSwitcher locator is a 'TODO' placeholder.
      await expect(globalHeaderPage.getAudienceSwitcherLocator()).toBeVisible();
      await expect(globalHeaderPage.getAudienceSwitcherLocator()).toBeEnabled();
    });

    // Step 3: Select 'SMB Advertiser' from the audience options.
    await test.step(`Select '${audienceTypeToSelect}' from the audience options`, async () => {
      await globalHeaderPage.selectAudienceType(audienceTypeToSelect);
      // Expected Result: Selection is registered and UI updates to reflect the choice.
      // NOTE: This assertion cannot be performed as the selectAudienceType method contains 'TODO' placeholders for interaction.
      // In a real scenario, you would assert on the visible text or state reflecting the selection.
      // For example: await expect(globalHeaderPage.getAudienceActiveSelectionText()).toHaveText(audienceTypeToSelect);
    });
  });
});
