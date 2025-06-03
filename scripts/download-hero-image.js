const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const imagePath = path.join(__dirname, '../public/images/hero/supply-chain-dashboard.jpg');

// Create directory if it doesn't exist
const dir = path.dirname(imagePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log('Downloading hero image...');

https.get(imageUrl, (response) => {
  if (response.statusCode === 200) {
    const file = fs.createWriteStream(imagePath);
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Image successfully downloaded to: ${imagePath}`);
    });
  } else {
    console.error(`Failed to download image. Status code: ${response.statusCode}`);
  }
}).on('error', (err) => {
  console.error(`Error downloading image: ${err.message}`);
}); 