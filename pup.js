const puppeteer = require('puppeteer');

const url = 'https://witanime.cyou/episode/isekai-yururi-kikou-kosodateshinagara-boukensha-shimasu-%d8%a7%d9%84%d8%ad%d9%84%d9%82%d8%a9-5/';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the #episode-servers element to load
  await page.waitForSelector('#episode-servers');

  // Extract the data-url attributes from <a> tags inside <li> elements within the <ul> with id="episode-servers"
  const dataUrls = await page.evaluate(() => {
    // Get all <li> elements within the <ul> with id="episode-servers"
    const items = document.querySelectorAll('#episode-servers li a');
    // Map over the items to extract the data-url attribute
    return Array.from(items).map(item => item.getAttribute('data-url'));
  });

  console.log('Data URLs:', dataUrls);

  await browser.close();
})();
