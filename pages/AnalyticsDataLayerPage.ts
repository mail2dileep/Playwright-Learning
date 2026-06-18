import { Page } from '@playwright/test';

export class AnalyticsDataLayerPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigates to a specific URL
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // Wait until a data layer object (e.g., 'digitalData') exists and is populated
  async waitForDataLayer(objectPath: string = 'digitalData', timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      (path: string) => {
        const getByPath = (root: any, p: string) => p.split('.').reduce((o, k) => (o && (k in o) ? o[k] : undefined), root);
        const obj = getByPath(window as any, path);
        if (!obj) return false;
        if (Array.isArray(obj)) return obj.length > 0;
        if (typeof obj === 'object') return Object.keys(obj).length > 0;
        return Boolean(obj);
      },
      objectPath,
      { timeout }
    );
  }

  // Retrieve the full data layer object by path (e.g., 'digitalData' or 'app.analytics.digitalData')
  async getDataLayer<T = any>(objectPath: string = 'digitalData'): Promise<T | null> {
    return await this.page.evaluate((path: string) => {
      const getByPath = (root: any, p: string) => p.split('.').reduce((o, k) => (o && (k in o) ? o[k] : undefined), root);
      const value = getByPath(window as any, path);
      if (typeof value === 'undefined') return null;
      try {
        // Prefer a JSON-safe clone to avoid serialization issues
        return JSON.parse(JSON.stringify(value));
      } catch {
        try {
          // Fallback if structuredClone exists
          // @ts-ignore
          return typeof structuredClone === 'function' ? structuredClone(value) : value;
        } catch {
          // Last resort: return raw value (may not be serializable)
          return value;
        }
      }
    }, objectPath);
  }

  // Retrieve a subset of mandatory fields from the data layer
  async getMandatoryFields(objectPath: string, fields: string[]): Promise<Record<string, any>> {
    const data = await this.getDataLayer<Record<string, any>>(objectPath);
    const result: Record<string, any> = {};
    if (data && typeof data === 'object') {
      for (const f of fields) {
        result[f] = (data as any)[f];
      }
    }
    return result;
  }

  // Retrieve a nested value from the data layer by property path (e.g., 'page.pageInfo.pageName')
  async getNestedValue(objectPath: string, propertyPath: string): Promise<any> {
    return await this.page.evaluate(({ objPath, propPath }) => {
      const getByPath = (root: any, p: string) => p.split('.').reduce((o, k) => (o && (k in o) ? o[k] : undefined), root);
      const base = getByPath(window as any, objPath);
      if (!base) return undefined;
      return getByPath(base, propPath);
    }, { objPath: objectPath, propPath: propertyPath });
  }
}
