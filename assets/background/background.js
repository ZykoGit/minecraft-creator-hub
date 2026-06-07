// ===============================
//  SEASONAL BACKGROUND SYSTEM
// ===============================

// Change this to "spring", "summer", "fall", "winter", or "auto"
let seasonMode = "fall";

// Texture URLs
const textures = {
    spring: {
        dirt: "https://zykogit.github.io/minecraft-creator-hub/assets/dirt.png",
        overlay: "https://zykogit.github.io/minecraft-creator-hub/assets/grass_side_overlay.png"
    },
    summer: "https://zykogit.github.io/minecraft-creator-hub/assets/dirt_path_side.png",
    fall:   "https://zykogit.github.io/minecraft-creator-hub/assets/mycelium_side.png",
    winter: "https://zykogit.github.io/minecraft-creator-hub/assets/grass_block_side_snowed.png"
};

// Determine real season if auto
function getRealSeason() {
    const month = new Date().getMonth() + 1;

    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "fall";
    return "winter";
}

// Main entry
function startBackground() {
    const season = seasonMode === "auto" ? getRealSeason() : seasonMode;

    if (season === "spring") {
        generateSpring();
    } else {
        generateSimple(textures[season]);
    }
}

// SPRING (special tinting logic)
function generateSpring() {
    const dirtURL = textures.spring.dirt;
    const overlayURL = textures.spring.overlay;

    Promise.all([loadImage(dirtURL), loadImage(overlayURL)]).then(([dirt, overlay]) => {

        // Base 16×16 canvas
        const base = document.createElement("canvas");
        base.width = 16;
        base.height = 16;
        const bctx = base.getContext("2d", { willReadFrequently: true });

        // Pixel art mode
        bctx.imageSmoothingEnabled = false;
        bctx.webkitImageSmoothingEnabled = false;
        bctx.mozImageSmoothingEnabled = false;

        bctx.drawImage(dirt, 0, 0, 16, 16);

        // Overlay
        const oCanvas = document.createElement("canvas");
        oCanvas.width = 16;
        oCanvas.height = 16;
        const octx = oCanvas.getContext("2d", { willReadFrequently: true });

        octx.imageSmoothingEnabled = false;
        octx.webkitImageSmoothingEnabled = false;
        octx.mozImageSmoothingEnabled = false;

        octx.drawImage(overlay, 0, 0, 16, 16);

        const oData = octx.getImageData(0, 0, 16, 16);

        // Bright spring tint
        const tint = { r: 140, g: 220, b: 100 };

        // Apply tint
        for (let i = 0; i < oData.data.length; i += 4) {
            const alpha = oData.data[i + 3];
            if (alpha > 0) {
                const gray = oData.data[i];
                oData.data[i]     = (tint.r * gray) / 255;
                oData.data[i + 1] = (tint.g * gray) / 255;
                oData.data[i + 2] = (tint.b * gray) / 255;
            }
        }

        octx.putImageData(oData, 0, 0);
        bctx.drawImage(oCanvas, 0, 0);

        applyAsBackground(base);
    });
}

// SUMMER / FALL / WINTER (simple scaling)
function generateSimple(url) {
    loadImage(url).then(img => {
        const base = document.createElement("canvas");
        base.width = 16;
        base.height = 16;

        const ctx = base.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, 16, 16);

        applyAsBackground(base);
    });
}

// Scale to 80×80 and apply
function applyAsBackground(baseCanvas) {
    const final = document.createElement("canvas");
    final.width = 80;
    final.height = 80;

    const fctx = final.getContext("2d");
    fctx.imageSmoothingEnabled = false;
    fctx.webkitImageSmoothingEnabled = false;
    fctx.mozImageSmoothingEnabled = false;

    fctx.drawImage(baseCanvas, 0, 0, 80, 80);

    const url = final.toDataURL("image/png");

    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "80px 80px";
    document.body.style.imageRendering = "pixelated";
}

// Loader
function loadImage(src) {
    return new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.src = src;
    });
}

// Start
startBackground();
