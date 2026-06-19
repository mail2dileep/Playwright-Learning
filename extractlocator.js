const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function extractLocators(url) {

  const browser =
    await chromium.launch({
      headless: true
    });

  const page =
    await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle"
  });
 

 try {

  const calculatorLink =
    page.getByText(
      "Energy Cost Calculator"
    );

  if (
    await calculatorLink.count()
  ) {

    await calculatorLink.first().click();

    await page.waitForTimeout(3000);

    console.log(
      "Calculator link clicked"
    );

  }

} catch (error) {

  console.log(
    "Calculator link not found or not clickable"
  );

} 

  const pageTitle =
    await page.title();
    const controlCount =
  await page.locator(
    "div.calculator_current input, div.calculator_current select, div.calculator_current button"
  ).count();

const html =
  await page.locator(
    "div.calculator_current"
  ).innerHTML();

  const elements =
    await page.evaluate(() => {
      
const container =
  document.querySelector(
    "div.calculator_current"
  );
   if (!container) {

      console.error(
        "Calculator container not found"
      );

      return [];

    }
 


const nodes =
  container.querySelectorAll(`
    input,
    button,
    select,
    textarea,    
    a,
    [role='button'],
    [role='radio'],
    [role='checkbox'],
    [role='combobox'],
    [data-testid]
  `);
  console.log(
  "Nodes Found:",
  nodes.length
);

    return Array.from(nodes).map(el => {

  const testId =
    el.getAttribute("data-testid");

  const ariaLabel =
    el.getAttribute("aria-label");

  const placeholder =
    el.getAttribute("placeholder");

  const name =
    el.getAttribute("name");

  const title =
    el.getAttribute("title");

  const type =
    el.getAttribute("type");
	
const value =
  el.getAttribute("value");

  const id =
    el.id || null;
	
const label =
  id
    ? container.querySelector(
        `label[for="${id}"]`
      )?.innerText?.trim()
    : el.closest("label")
        ?.innerText?.trim() ||      
      el.closest("fieldset")
        ?.querySelector("legend")
        ?.innerText?.trim() ||
      null;

const role =
  el.getAttribute(
    "role"
  );
  
  const options =
  el.tagName === "SELECT"
    ? Array.from(el.options).map(
        option => ({
          text: option.text,
          value: option.value
        })
      )
    : null;

    const visible =
  el.offsetParent !== null;

 let recommendedLocator = null;

if (
  el.type === "radio" &&
  label
) {

  recommendedLocator =
    `getByLabel('${label}')`;

} else if (testId) {

  recommendedLocator =
    `getByTestId('${testId}')`;

} else if (ariaLabel) {

  recommendedLocator =
    `getByLabel('${ariaLabel}')`;

} else if (label) {

  recommendedLocator =
    `getByLabel('${label}')`;

} else if (id) {

  recommendedLocator =
    `locator('#${id}')`;

} else if (
  placeholder &&
  (el.tagName === "INPUT" ||
   el.tagName === "TEXTAREA")
) {

  recommendedLocator =
    `getByPlaceholder('${placeholder}')`;

} else if (
   el.tagName === "BUTTON" &&
  el.innerText &&
  el.innerText.trim()
) {

  recommendedLocator =
    `getByText('${el.innerText.trim()}')`;

}

const currentValue =
  el.value || null;

  const className =
  el.className || null;

  const href =
  el.getAttribute("href");

return {

  tag:
    el.tagName.toLowerCase(),
    parentContainer:
    "calculator_current",
   disabled:
    el.disabled || false,

  enabled:
    !el.disabled,

  text:
    (el.innerText || el.textContent || "").trim(),
   displayName:
    label ||
    ariaLabel ||
    (el.innerText || "").trim() ||
    placeholder ||
    name ||
    id,

  id,

  label,
  
  placeholder,
  
  name,
  
  title,
  
  type,

  radioGroup:
  el.type === "radio"
    ? el.name
    : null,

   inputType: el.type || null,
   
  checked: el.checked || false,

  

required:
  el.required || false,

  
  value,

  role,

  ariaLabel,

  testId,

  recommendedLocator,

   locatorPriority:
    testId ? 1 :
    ariaLabel ? 2 :
    label ? 3 :
    id ? 4 :
    placeholder ? 5 :
    99,

  options,

  currentValue,

  visible,

  className,
  href,
  locatorType:
  recommendedLocator?.includes(
    "getByTestId"
  )
    ? "testId"
    : recommendedLocator?.includes(
        "getByLabel"
      )
    ? "label"
    : recommendedLocator?.includes(
        "locator('#"
      )
    ? "id"
    : recommendedLocator?.includes(
        "getByText"
      )
    ? "text"
    : "unknown",


};
});
});

  const output = {

  pageTitle,
  url,
  extractedAt:
    new Date().toISOString(),
  elements

};

output.elements =
  output.elements.filter(
    e =>
      e.visible === true &&
       e.recommendedLocator &&
      (
        e.text ||
        e.label ||
        e.placeholder ||
        e.id ||
        e.testId ||
        e.ariaLabel ||
        e.name ||
        e.href
      )
  );

  

    output.elements.sort(
  (a, b) =>
    (a.locatorPriority || 99) -
    (b.locatorPriority || 99)
);

 const outputFile =
  path.join(
    __dirname,
    "locators",
    "locators.json"
  );


fs.writeFileSync(
  outputFile,
  JSON.stringify(
    output,
    null,
    2
  )
);

  await browser.close();

console.log(
  `Saved ${output.elements.length} locators to ${outputFile}`
);

}

extractLocators(
  "https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/energy-cost-calculator.html"
);