document.addEventListener("touchstart", function(){}, true);

const year = new Date().getFullYear();
document.getElementById("year-top").textContent = year;
document.getElementById("year-bottom").textContent = year;

function toggleDisclaimer() {
    const box = document.getElementById("disclaimer");
    box.style.display = box.style.display === "block" ? "none" : "block";
}
