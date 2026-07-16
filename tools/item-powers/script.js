document.addEventListener("touchstart", function(){}, true);

const year = new Date().getFullYear();
document.getElementById("year-top").textContent = year;
document.getElementById("year-bottom").textContent = year;

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
    
    const stepsHTML = `
        <ol style="padding-left: 20px; text-align: left; overflow-wrap: break-word;">
            <li>
                In the chat do:<br>
                <code>/gamerule commandblockoutput false</code><br>
                <code>/tickingarea add circle ~ ~ ~ 4 dummyText</code>
            </li>

            <li>
                Then do:<br>
                <code>/give @s ${item} 1 50</code><br>
                <code>/give @s command_block</code>
            </li>

            <li>
                Place a command block and set it to:<br>
                • Always Active<br>
                • Unconditional<br>
                • Repeating
            </li>

            <li>
                Set the command to:<br>
                <code>
                execute as @a[hasitem={item=${item},location=slot.weapon.mainhand,data=50}] run effect @s ${power} 1 10 true
                </code>
            </li>
        </ol>
    `;

    resultText.innerHTML = stepsHTML;
    resultBox.style.display = "block";
});
