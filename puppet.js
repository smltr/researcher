import puppeteer from "https://deno.land/x/puppeteer/mod.ts";

export async function visit(url) {
  console.log(`Visiting ${url}`);
  if (!url) {
    throw new Error("URL is required");
  }

  const browser = await puppeteer.launch({
    args: [
      "--incognito",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"',
    ],
    headless: true,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract text content
    const content = await page.evaluate(() => {
      function getTextFromElement(element) {
        return element.innerText || element.textContent || "";
      }

      function removeScriptsAndStyles(doc) {
        const scripts = doc.querySelectorAll("script, style");
        scripts.forEach((script) => script.remove());
      }

      function appendLinkTexts(doc) {
        const links = doc.querySelectorAll("a[href]");
        links.forEach((link) => {
          const linkText = ` [${link.href}]`;
          link.append(linkText);
        });
      }

      removeScriptsAndStyles(document);
      appendLinkTexts(document);
      return getTextFromElement(document.body).trim();
    });

    await browser.close();
    return content;
  } catch (error) {
    await browser.close();
    throw error;
  }
}
