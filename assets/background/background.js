// ===============================
//  SPRING BACKGROUND GENERATOR
// ===============================

const dirtURL = "https://zykogit.github.io/minecraft-creator-hub/assets/dirt.png";
const overlayURL = "https://zykogit.github.io/minecraft-creator-hub/assets/grass_side_overlay.png";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.imageSmoothingEnabled = false;

Promise.all([
    loadImage(dirtURL),
    loadImage(overlayURL)
]).then(([dirt, overlay]) => {

    const size = 16;
    canvas.width = size;
    canvas.height = size;

    // Draw dirt base
    ctx.drawImage(dirt, 0, 0, size, size);

    // Get overlay pixels
    const overlayCanvas = document.createElement("canvas");
    const overlayCtx = overlayCanvas.getContext("2d", { willReadFrequently: true });
    overlayCanvas.width = size;
    overlayCanvas.height = size;
    overlayCtx.imageSmoothingEnabled = false;

    overlayCtx.drawImage(overlay, 0, 0, size, size);
    const overlayData = overlayCtx.getImageData(0, 0, size, size);

    // Tint color (Minecraft biome green)
    const tint = { r: 95, g: 159, b: 53 };

    // Apply tint ONLY to overlay pixels
    for (let i = 0; i < overlayData.data.length; i += 4) {
        const alpha = overlayData.data[i + 3];

        if (alpha > 0) {
            overlayData.data[i] = tint.r;
            overlayData.data[i + 1] = tint.g;
            overlayData.data[i + 2] = tint.b;
        }
    }

    // Draw tinted overlay on top of dirt
    overlayCtx.putImageData(overlayData, 0, 0);
    ctx.drawImage(overlayCanvas, 0, 0);

    // Scale up for background
    const scale = 32;
    const bigCanvas = document.createElement("canvas");
    const bigCtx = bigCanvas.getContext("2d");
    bigCtx.imageSmoothingEnabled = false;

    bigCanvas.width = size * scale;
    bigCanvas.height = size * scale;

    bigCtx.drawImage(canvas, 0, 0, bigCanvas.width, bigCanvas.height);

    const finalTexture = bigCanvas.toDataURL("image/png");

    document.body.style.backgroundImage = `url(${finalTexture})`;
    document.body.style.backgroundRepeat = "repeat";
});

// Image loader helper
function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.src = src;
    });
}
