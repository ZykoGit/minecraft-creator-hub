// Fix for iOS touch delay (same as main page)
document.addEventListener("touchstart", function(){}, true);

// YEAR BADGES
const year = new Date().getFullYear();
document.getElementById("year-top").textContent = year;
document.getElementById("year-bottom").textContent = year;

// FORM LOGIC
const itemSelect = document.getElementById("item");
const powerSelect = document.getElementById("power");
const generateBtn = document.getElementById("generate");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result-text");

generateBtn.addEventListener("click", () => {
    const item = itemSelect.value;
    const power = powerSelect.value;

    if (!item || !power) {
        alert("Please choose both an item and a power");
        return;
    }

    // Placeholder — real command block steps will be added later
    resultText.textContent =
        `You selected ${item} with the power ${power}. Steps will appear here soon.`;

    resultBox.style.display = "block";
});
