/* LOAD MENU FROM JSON */
fetch("../assets/documents/sitemap.json")
    .then(res => res.json())
    .then(data => buildMenu(data.menu));

function buildMenu(menu, parentElement = document.getElementById("sideMenu"), level = 0) {
    menu.forEach(item => {
        const btn = document.createElement("div");
        btn.className = level === 0 ? "menu-item" : "submenu-item";
        btn.textContent = item.label;

        // Indent deeper levels
        btn.style.marginLeft = (level * 20) + "px";

        if (item.link) {
            btn.onclick = () => location.href = item.link;
        }

        parentElement.appendChild(btn);

        // If item has children → build nested submenu
        if (item.children) {
            const submenu = document.createElement("div");
            submenu.className = "submenu";
            submenu.style.display = "none";

            parentElement.appendChild(submenu);

            btn.onclick = () => {
                submenu.style.display = submenu.style.display === "block" ? "none" : "block";
            };

            // RECURSION — build children inside this submenu
            buildMenu(item.children, submenu, level + 1);
        }
    });
}

/* MENU OPEN/CLOSE */
const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("sideMenu");

toggle.onclick = () => {
    toggle.classList.toggle("menu-open");
    menu.classList.toggle("open");
};
