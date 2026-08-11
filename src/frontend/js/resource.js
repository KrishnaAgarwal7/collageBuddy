const API = "http://127.0.0.1:3000";

const container =
    document.getElementById("resourceContainer");


// ============================
// GET RESOURCE ID
// ============================

const params =
    new URLSearchParams(window.location.search);

const resourceId =
    params.get("id");


if (!resourceId) {

    container.innerHTML = `
        <div class="error">
            Resource ID not found.
        </div>
    `;

} else {

    loadResource();

}


// ============================
// LOAD RESOURCE
// ============================

async function loadResource() {

    try {

        const response = await fetch(
            `${API}/resources/${resourceId}`,
            {
                credentials: "include"
            }
        );


        const data =
            await response.json();


        console.log("Resource:", data);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to fetch resource"
            );

        }


        displayResource(data.resource);


    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="error">
                ${err.message}
            </div>
        `;

    }

}


// ============================
// DISPLAY RESOURCE
// ============================

function displayResource(resource) {

    const isFile =
        resource.resourceType === "file";


    const icon =
        isFile ? "📄" : "🔗";


    const typeClass =
        isFile
            ? "file-type"
            : "link-type";


    const typeText =
        isFile
            ? "FILE"
            : "EXTERNAL LINK";


    container.innerHTML = `

        <div class="resource-header">

            <div>

                <div class="resource-icon">
                    ${icon}
                </div>

                <h1>
                    ${resource.title}
                </h1>

                <span
                    class="resource-type ${typeClass}"
                >
                    ${typeText}
                </span>

            </div>

        </div>


        <p class="description">

            ${
                resource.description ||
                "No description provided."
            }

        </p>


        <div class="details">

            <div class="detail">

                <div class="detail-label">
                    Course
                </div>

                <div class="detail-value">
                    ${resource.courseID}
                </div>

            </div>


            <div class="detail">

                <div class="detail-label">
                    Semester
                </div>

                <div class="detail-value">
                    Semester ${resource.semester}
                </div>

            </div>


            <div class="detail">

                <div class="detail-label">
                    Resource Type
                </div>

                <div class="detail-value">
                    ${resource.resourceType}
                </div>

            </div>


            <div class="detail">

                <div class="detail-label">
                    Uploaded By
                </div>

                <div class="detail-value">

                    ${
                        resource.uploadedBy?.name ||
                        "Unknown"
                    }

                </div>

            </div>

        </div>


        <div class="uploader">

            <strong>
                Uploaded by
            </strong>

            <p>
                ${
                    resource.uploadedBy?.name ||
                    "Unknown"
                }

                ${
                    resource.uploadedBy?.email
                        ? ` • ${resource.uploadedBy.email}`
                        : ""
                }
            </p>

        </div>


        ${
            isFile

            ?

            `
            <a
                href="${resource.fileUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn"
            >
                📄 Open File
            </a>
            `

            :

            `
            <a
                href="${resource.externalLink}"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn"
            >
                🔗 Open Resource
            </a>
            `

        }

    `;
}