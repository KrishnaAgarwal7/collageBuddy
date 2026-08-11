const API = "http://127.0.0.1:3000";


// =============================
// GET CURRENT USER
// =============================

async function loadUser() {

    try {

        const response = await fetch(
            `${API}/users/me`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("userName").textContent =
            data.user.name;

        // If profile somehow isn't complete
        if (!data.profileCompleted) {
            window.location.href = "complete-profile.html";
        }

    } catch (err) {

        console.log(err);

    }
}


// =============================
// GET RECENT RESOURCES
// =============================

async function loadResources() {

    try {

        const response = await fetch(
            `${API}/resources`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const container =
            document.getElementById("resourcesContainer");

        container.innerHTML = "";

        const resources =
            data.resources.slice(0, 5);

        if (resources.length === 0) {

            container.innerHTML =
                `<div class="loading">
                    No resources available.
                </div>`;

            return;
        }

        resources.forEach(resource => {

            const card =
                document.createElement("div");

            card.className = "resource-card";

            const typeClass =
                resource.resourceType === "file"
                    ? "file-type"
                    : "link-type";

            card.innerHTML = `
                <div>
                    <div class="resource-title">
                        ${resource.title}
                    </div>

                    <div class="resource-meta">
                        ${resource.courseId}
                        • Semester ${resource.semester}
                    </div>
                </div>

                <span class="resource-type ${typeClass}">
                    ${resource.resourceType}
                </span>
            `;

            container.appendChild(card);

        });

    } catch (err) {

        console.log(err);

    }
}


// =============================
// GET RECENT LOST & FOUND
// =============================

async function loadLostFound() {

    try {

        const response = await fetch(
            `${API}/lost-found`,
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        const container =
            document.getElementById("lostFoundContainer");

        container.innerHTML = "";

        const reports =
            data.reports.slice(0, 3);

        if (reports.length === 0) {

            container.innerHTML =
                `<div class="loading">
                    No recent reports.
                </div>`;

            return;
        }

        reports.forEach(report => {

            const card =
                document.createElement("div");

            card.className = "lost-card";

            const type =
                report.type.toLowerCase();

            card.innerHTML = `
                <div class="lost-label ${type}">
                    ${report.type.toUpperCase()}
                </div>

                <h3>
                    ${report.title}
                </h3>

                <p>
                    📍 ${report.location}
                </p>
            `;

            container.appendChild(card);

        });

    } catch (err) {

        console.log(err);

    }
}


// =============================
// LOGOUT
// =============================

document
    .getElementById("logoutBtn")
    .addEventListener("click", async () => {

        try {

            await fetch(
                `${API}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (err) {

            console.log(err);

        }

        window.location.href = "login.html";

    });


// =============================
// SEARCH
// =============================

document
    .getElementById("searchBtn")
    .addEventListener("click", () => {

        const search =
            document.getElementById("searchInput").value.trim();

        if (!search) {
            return;
        }

        window.location.href =
            `resources.html?search=${encodeURIComponent(search)}`;

    });


// =============================
// INITIAL LOAD
// =============================

loadUser();
loadResources();
loadLostFound();