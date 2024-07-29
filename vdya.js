// to get the video url from upload videa website


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
    console.log(`Navigating to URL: ${url_website}`);
    await page.goto(url_website, { 
      waitUntil: 'networkidle2', 
      timeout: 120000
    });

    console.log('Waiting for video element...');
    await page.waitForSelector('video', { timeout: 60000 });

    // Custom delay function
    const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for a few seconds to let the video src load
    console.log('Waiting for additional 5 seconds...');
    await waitFor(5000); // Adjust the timeout as needed

    videoSrc = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.src) {
        return videoElement.src;
      } else {
        return null;
      }
    });

    console.log('Video source found:', videoSrc);
  } catch (error) {
    console.error('Error retrieving video source:', error);
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

  // Capture the start time
  const startTime = new Date();

  // Basic URL validation
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlMatch = messageText.match(urlRegex);

  if (urlMatch) {
    const url = urlMatch[0];
    console.log(`Received URL: ${url}`);
    try {
      const videoUrl = await getVideoSrc(url);
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds

      const replyText = `${videoUrl || 'No video source found.'}\n\nTime taken: ${timeTaken.toFixed(2)} seconds`;
      ctx.reply(replyText);
    } catch (error) {
      console.error('Error processing URL:', error);
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds

      ctx.reply(`Error retrieving video source.\n\nTime taken: ${timeTaken.toFixed(2)} seconds`);
    }
  } else {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time taken in seconds

    ctx.reply(`Please send a valid website URL.\n\nTime taken: ${timeTaken.toFixed(2)} seconds`);
  }
});

// Launch the bot
bot.launch().then(() => {
  console.log('Bot is running...');
}).catch(err => {
  console.error('Error launching bot:', err);
});
