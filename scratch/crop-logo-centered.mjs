import sharp from "sharp";

async function cropCentered() {
  try {
    const size = 580;
    const left = 58;
    const top = 21;
    
    await sharp("public/rk-global-circular.png")
      .extract({ left, top, width: size, height: size })
      .toFile("public/rk-global-circular-centered.png");
      
    console.log("Centered cropped image created successfully!");
  } catch (err) {
    console.error("Error cropping centered image:", err);
  }
}

cropCentered();
