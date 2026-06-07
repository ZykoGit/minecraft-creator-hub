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

    // Build the steps
    const step1 = `1) In the chat do:\n` +
                  `   /gamerule commandblockoutput false\n` +
                  `   /tickingarea add circle ~ ~ ~ 4 dummyText`;

    const step2 = `2) Then do:\n` +
                  `   /give @s ${item} 1 50\n` +
                  `   /give @s command_block`;

    const step3 = `3) Place a command block and set it to:\n` +
                  `   • Always Active\n` +
                  `   • Unconditional\n` +
                  `   • Repeating`;

    const step4 = `4) Set the command to:\n` +
                  `   execute as @a[hasitem={item=${item},location=slot.weapon.mainhand,data=50}] run effect @s ${power} 1 10 true`;

    // Combine all steps
    resultText.textContent = `${step1}\n\n${step2}\n\n${step3}\n\n${step4}`;

    resultBox.style.display = "block";
});
