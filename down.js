const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace this with the direct video URL you obtained from the inspection
const videoUrl = 'https://video4.videa.hu/static/480p/8.2841378.2306131.1.13.1.1?md5=rdcv2cWyHbX4prpSsRfwFQ&expires=1722304289';
const outputPath = path.resolve(__dirname, 'video.mp4');

async function downloadVideo(url, outputPath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(fs.createWriteStream(outputPath));

    console.log('Downloading video...');

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log('Download completed!');
        resolve();
      });
      response.data.on('error', (err) => {
        console.error('Error downloading video:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

downloadVideo(videoUrl, outputPath);
