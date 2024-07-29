
const puppeteer = require('puppeteer');
const atob = require('atob'); // Install the atob package: npm install atob

/**
 * Processes the URLs from the given page URL.
 * @param {string} pageUrl - The URL of the page to scrape.
 * @returns {Promise<string[]>} - A promise that resolves to an array of processed URLs.
 */
async function get_urls_from_witanime_episode_page(pageUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(pageUrl, { waitUntil: 'networkidle2' });

  // Wait for the #episode-servers element to load
  await page.waitForSelector('#episode-servers');

  // Extract the data-url attributes from <a> tags inside <li> elements within the <ul> with id="episode-servers"
  const dataUrls = await page.evaluate(() => {
    const items = document.querySelectorAll('#episode-servers li a');
    return Array.from(items).map(item => item.getAttribute('data-url'));
  });

  // Process each link
  const processedUrls = dataUrls.map(encodedUrl => {
    // Decode the URL
    const decodedUrl = atob(encodedUrl);

    // Ensure the URL starts with 'https:'
    if (decodedUrl.startsWith('//')) {
      // Convert protocol-relative URLs to 'https:'
      return `https:${decodedUrl}`;
    } else if (!decodedUrl.startsWith('https://')) {
      // If the URL does not start with 'https:', prepend 'https://'
      return `https://${decodedUrl}`;
    } else {
      return decodedUrl;
    }
  });

  await browser.close();
  return processedUrls;
}

// Example usage
(async () => {
  const pageUrl = 'https://witanime.cyou/episode/isekai-yururi-kikou-kosodateshinagara-boukensha-shimasu-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-5/';
  const processedUrls = await get_urls_from_witanime_episode_page(pageUrl);
  console.log('Processed URLs:', processedUrls);
})();
