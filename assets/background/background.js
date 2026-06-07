// ===============================
//  SEASONAL BACKGROUND SYSTEM
// ===============================

// Change this to "spring", "summer", "fall", "winter", or "auto"
let seasonMode = "summer"; // Auto is kinda broken rn so imma have to do it manually 😔🤞

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

// ===============================
//  PUBLIC API SEASON DETECTION
// ===============================

async function getRealSeason() {
    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;

            try {
                const res = await fetch(url);
                const data = await res.json();

                const temp = data.current.temperature_2m;
                const month = new Date().getMonth() + 1;

                let season;

                // Temperature-based season guess
                if (temp <= 5) season = "winter";
                else if (temp <= 15) season = "fall";
                else if (temp <= 25) season = "spring";
                else season = "summer";

                // Month-based override (meteorological seasons)
                if (month >= 12 || month <= 2) season = "winter";
                if (month >= 3 && month <= 5) season = "spring";
                if (month >= 6 && month <= 8) season = "summer";
                if (month >= 9 && month <= 11) season = "fall";

                resolve(season);

            } catch (err) {
                console.error("API error:", err);
                resolve("summer"); // fallback
            }
        }, err => {
            console.error("Location error:", err);
            resolve("summer"); // fallback
        });
    });
}

// ===============================
//  MAIN ENTRY
// ===============================

async function startBackground() {
    const season = seasonMode === "auto"
        ? await getRealSeason()
        : seasonMode;

    if (season === "spring") {
        generateSpring();
    } else {
        generateSimple(textures[season]);
    }
}

// ===============================
//  SPRING (special tinting logic)
// ===============================

function generateSpring() {
    const dirtURL = textures.spring.dirt;
    const overlayURL = textures.spring.overlay;

    Promise.all([loadImage(dirtURL), loadImage(overlayURL)]).then(([dirt, overlay]) => {

        const base = document.createElement("canvas");
        base.width = 16;
        base.height = 16;
        const bctx = base.getContext("2d", { willReadFrequently: true });

        bctx.imageSmoothingEnabled = false;

        bctx.drawImage(dirt, 0, 0, 16, 16);

        const oCanvas = document.createElement("canvas");
        oCanvas.width = 16;
        oCanvas.height = 16;
        const octx = oCanvas.getContext("2d", { willReadFrequently: true });

        octx.imageSmoothingEnabled = false;
        octx.drawImage(overlay, 0, 0, 16, 16);

        const oData = octx.getImageData(0, 0, 16, 16);

        const tint = { r: 140, g: 220, b: 100 };

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

// ===============================
//  SUMMER / FALL / WINTER
// ===============================

function generateSimple(url) {
    loadImage(url).then(img => {
        const base = document.createElement("canvas");
        base.width = 16;
        base.height = 16;

        const ctx = base.getContext("2d");
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, 16, 16);

        applyAsBackground(base);
    });
}

// ===============================
//  SCALE TO 80×80 AND APPLY
// ===============================

function applyAsBackground(baseCanvas) {
    const final = document.createElement("canvas");
    final.width = 80;
    final.height = 80;

    const fctx = final.getContext("2d");
    fctx.imageSmoothingEnabled = false;

    fctx.drawImage(baseCanvas, 0, 0, 80, 80);

    const url = final.toDataURL("image/png");

    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "80px 80px";
    document.body.style.imageRendering = "pixelated";
}

// ===============================
//  IMAGE LOADER
// ===============================

function loadImage(src) {
    return new Promise(res => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => res(img);
        img.src = src;
    });
}

// ===============================
//  START
// ===============================

startBackground();
