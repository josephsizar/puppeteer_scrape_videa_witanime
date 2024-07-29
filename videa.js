// get the video url from videa upload videos

const puppeteer = require('puppeteer');

async function getVideoSrc(url_website) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let videoSrc = null;

  try {
    await page.goto(url_website, { 
      waitUntil: 'networkidle2', 
      timeout: 120000 // Increased timeout to 120 seconds
    });

    await page.waitForSelector('video', { timeout: 60000 });

    // Custom delay function
    const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for a few seconds to let the video src load
    await waitFor(5000); // Adjust the timeout as needed

    // Retry getting the video src
    videoSrc = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.src) {
        return videoElement.src;
      } else {
        return null;
      }
    });
  } catch (error) {
    // Optionally handle the error (e.g., log it, throw it, etc.)
    videoSrc = null;
  } finally {
    await browser.close();
  }

  return videoSrc;
}

// Example usage
(async () => {
  const url = 'https://videa.hu/player?v=9UKlkmstTsAe4IWz';
  const videoUrl = await getVideoSrc(url);
  console.log('Video src:', videoUrl || 'No video source found');
})();


