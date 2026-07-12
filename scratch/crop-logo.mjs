import sharp from "sharp";

async function crop() {
  try {
    const meta = await sharp("public/rk-global-circular.png").metadata();
    console.log("Original metadata:", meta);
    
    if (meta.width && meta.height) {
      const size = Math.min(meta.width, meta.height);
      const left = Math.round((meta.width - size) / 2);
      const top = Math.round((meta.height - size) / 2);
      
      await sharp("public/rk-global-circular.png")
        .extract({ left, top, width: size, height: size })
        .toFile("public/rk-global-circular-cropped.png");
        
      console.log("Cropped successfully to 1:1 square!");
    }
  } catch (err) {
    console.error("Error cropping image:", err);
  }
}

crop();
