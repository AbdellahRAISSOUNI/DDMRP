# Hero Images

This project uses two main images for the hero section:

1. **Supply Chain Dashboard Image** - Located at `public/images/hero/supply-chain-dashboard.jpg`
2. **Background Pattern Image** - Located at `public/images/hero-bg.jpg`

## How to Replace Images

### Option 1: Using the Provided Scripts

We've included two Node.js scripts to download sample images:

```bash
# Download the main hero image (supply chain dashboard)
node scripts/download-hero-image.js

# Download the background pattern image
node scripts/download-bg-image.js
```

### Option 2: Manual Replacement

You can also manually replace these images:

1. Place your preferred hero image at `public/images/hero/supply-chain-dashboard.jpg`
2. Place your preferred background image at `public/images/hero-bg.jpg`

For best results:
- Hero image: Use an image with a 4:3 aspect ratio showing a supply chain dashboard, analytics, or similar professional content
- Background image: Use a subtle pattern or texture that won't distract from the main content

## Image Credits

The default images are from Pexels:
- Supply Chain Dashboard: Photo by Christina Morillo from Pexels
- Background Pattern: Photo by Pixabay from Pexels

## Customizing the Hero Component

If you want to make further adjustments to how the images are displayed, you can modify:

- `app/components/Hero.tsx` - For the main hero component structure and animations
- `app/globals.css` - For the CSS effects and animations 