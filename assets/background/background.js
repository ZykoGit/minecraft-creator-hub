// ===============================
//  SPRING BACKGROUND GENERATOR
// ===============================

// Texture paths
const dirtURL = "https://zykogit.github.io/minecraft-creator-hub/assets/dirt.png";
const overlayURL = "https://zykogit.github.io/minecraft-creator-hub/assets/grass_side_overlay.png";

// Canvas setup
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

// Make sure pixel art stays sharp
ctx.imageSmoothingEnabled = false;

// Load images
Promise.all([
    loadImage(dirtURL),
    loadImage(overlayURL)
]).then(([dirt, overlay]) => {

    // Base resolution (16×16)
    const size = 16;

    canvas.width = size;
    canvas.height = size;

    // Draw dirt first
    ctx.drawImage(dirt, 0, 0, size, size);

    // Apply green tint ONLY to overlay
    ctx.globalCompositeOperation = "source-over";

    // Draw overlay normally first
    ctx.drawImage(overlay, 0, 0, size, size);

    // Tint pass
    ctx.globalCompositeOperation = "source-atop";

    // Minecraft biome‑style green (approx)
    ctx.fillStyle = "rgba(95, 159, 53, 0.85)";
    ctx.fillRect(0, 0, size, size);

    // Reset composite mode
    ctx.globalCompositeOperation = "source-over";

    // Now scale up the canvas for background use
    const scale = 32; // 16px → 512px
    const bigCanvas = document.createElement("canvas");
    const bigCtx = bigCanvas.getContext("2d");
    bigCtx.imageSmoothingEnabled = false;

    bigCanvas.width = size * scale;
    bigCanvas.height = size * scale;

    bigCtx.drawImage(canvas, 0, 0, bigCanvas.width, bigCanvas.height);

    // Convert to PNG data URL
    const finalTexture = bigCanvas.toDataURL("image/png");

    // Apply as page background
    document.body.style.backgroundImage = `url(${finalTexture})`;
    document.body.style.backgroundRepeat = "repeat";
});

// Helper to load images
function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}
