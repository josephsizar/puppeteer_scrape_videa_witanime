const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
// Replace YOUR_TELEGRAM_BOT_TOKEN with your bot token
const bot = new Telegraf('7445379003:AAEUklI4zCtGQBHSW_tjRxuka2bCAHBf23M');


// Function to get video src from a URL
async function getVideoSrc(url_website) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let videoSrc = null;

  try {
    await page.goto(url_website, { 
      waitUntil: 'networkidle2', 
      timeout: 120000
    });

    await page.waitForSelector('video', { timeout: 60000 });

    const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    await waitFor(5000);

    videoSrc = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.src) {
        return videoElement.src;
      } else {
        return null;
      }
    });
  } catch (error) {
    videoSrc = null;
  } finally {
    await browser.close();
  }

  return videoSrc;
}

// Command for starting the bot
bot.start((ctx) => ctx.reply('Welcome! Send me a website URL, and I will find the video source for you.'));

// Command for handling messages
bot.on('text', async (ctx) => {
  const messageText = ctx.message.text;

  // Basic URL validation
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = messageText.match(urlRegex);

  if (urlMatch) {
    const url = urlMatch[0];
    try {
      const videoUrl = await getVideoSrc(url);
      ctx.reply(videoUrl || 'No video source found');
    } catch (error) {
      ctx.reply('Error retrieving video source.');
    }
  } else {
    ctx.reply('Please send a valid website URL.');
  }
});

// Launch the bot
bot.launch();
