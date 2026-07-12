import sharp from "sharp";

async function findBounds() {
  try {
    // Load image as raw pixel buffer (srgb -> red, green, blue channels)
    const { data, info } = await sharp("public/rk-global-circular.png")
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    const width = info.width;
    const height = info.height;
    const channels = info.channels; // usually 3 (RGB)
    
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    
    // We want to find pixels that are non-white (e.g. gray/black logo outlines)
    // White is 255, 255, 255. Let's use a threshold (e.g. luminance < 240)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 240) { // non-white pixel
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    console.log("Logo bounds found:");
    console.log({ minX, maxX, minY, maxY });
    console.log("Width of content:", maxX - minX);
    console.log("Height of content:", maxY - minY);
    console.log("Center X of content:", (minX + maxX) / 2);
    console.log("Center Y of content:", (minY + maxY) / 2);
  } catch (err) {
    console.error(err);
  }
}

findBounds();
