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
  await page.waitForTimeout(5000);

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

} catch(error) {

  console.log(
    "Calculator link not found or not clickable"
  );

}

  const pageTitle =
    await page.title();

  const elements =
    await page.evaluate(() => {

      const nodes =
       document.querySelectorAll(
  `
  input,
  button,
  select,
  textarea,
  a,
  [role='button'],
  [role='radio'],
  [role='checkbox'],
  [role='combobox'],
  [role='textbox'],
  [role='link'],
  [role='menuitem'],
  [data-testid]
  `
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
    ? document.querySelector(
        `label[for="${id}"]`
      )?.innerText?.trim()
    : el.closest("label")
        ?.innerText?.trim() || null;

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

  text:
    (el.innerText || el.textContent || "").trim(),

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

disabled:
  el.disabled || false,
  
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
  href

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
      e.text ||
      e.label ||
      e.placeholder ||
      e.id ||
      e.testId ||
      e.ariaLabel ||
      e.name ||
      e.href
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
  "https://www.cpsenergy.com/content/corporate/en/my-home/savings-programs/rate_estimator_residential.html"
);