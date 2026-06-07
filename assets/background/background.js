// ===============================
//  SPRING BACKGROUND GENERATOR
// ===============================

const dirtURL = "https://zykogit.github.io/minecraft-creator-hub/assets/dirt.png";
const overlayURL = "https://zykogit.github.io/minecraft-creator-hub/assets/grass_side_overlay.png";

Promise.all([loadImage(dirtURL), loadImage(overlayURL)]).then(([dirt, overlay]) => {

    // Base 16×16 canvas
    const base = document.createElement("canvas");
    base.width = 16;
    base.height = 16;
    const bctx = base.getContext("2d", { willReadFrequently: true });

    // EXACTLY how your other project disables smoothing
    bctx.imageSmoothingEnabled = false;
    bctx.webkitImageSmoothingEnabled = false;
    bctx.mozImageSmoothingEnabled = false;

    // Draw dirt
    bctx.drawImage(dirt, 0, 0, 16, 16);

    // Overlay canvas
    const oCanvas = document.createElement("canvas");
    oCanvas.width = 16;
    oCanvas.height = 16;
    const octx = oCanvas.getContext("2d", { willReadFrequently: true });

    octx.imageSmoothingEnabled = false;
    octx.webkitImageSmoothingEnabled = false;
    octx.mozImageSmoothingEnabled = false;

    octx.drawImage(overlay, 0, 0, 16, 16);

    const oData = octx.getImageData(0, 0, 16, 16);

    // Minecraft biome tint (spring)
    const tint = { r: 95, g: 159, b: 53 };

    // Apply tint ONLY to overlay pixels (Minecraft-style)
    for (let i = 0; i < oData.data.length; i += 4) {
        const alpha = oData.data[i + 3];
        if (alpha > 0) {
            const gray = oData.data[i]; // grayscale mask
            oData.data[i]     = (tint.r * gray) / 255;
            oData.data[i + 1] = (tint.g * gray) / 255;
            oData.data[i + 2] = (tint.b * gray) / 255;
        }
    }

    octx.putImageData(oData, 0, 0);

    // Draw tinted overlay onto dirt
    bctx.drawImage(oCanvas, 0, 0);

    // Now scale to EXACT 80×80 inside canvas (your method)
    const final = document.createElement("canvas");
    final.width = 80;
    final.height = 80;
    const fctx = final.getContext("2d");

    fctx.imageSmoothingEnabled = false;
    fctx.webkitImageSmoothingEnabled = false;
    fctx.mozImageSmoothingEnabled = false;

    fctx.drawImage(base, 0, 0, 80, 80);

    // Convert to PNG
    const url = final.toDataURL("image/png");

    // Apply as background
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundRepeat = "repeat";

    // HARD FORCE crisp rendering (backup)
    document.body.style.imageRendering = "pixelated";
    document.body.style.backgroundSize = "80px 80px";
});

// Helper
function loadImage(src) {
    return new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.src = src;
    });
}
