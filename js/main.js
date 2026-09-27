// Ny publicerad Railway-URL
const API_URL = "https://dt207g-lab2-rest-client-production.up.railway.app/api/workexperience";

document.addEventListener("DOMContentLoaded", fetchExperiences);

// Hämtar alla poster (GET)
async function fetchExperiences() {
    const listContainer = document.getElementById("experience-list");
    const errorElement = document.getElementById("error-message");

    listContainer.innerHTML = "";
    errorElement.textContent = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Kunde inte hämta data från servern.");
        }

        const data = await response.json();

        if (data.length === 0) {
            listContainer.innerHTML = "<tr><td colspan='6'>Inga arbetserfarenheter hittades.</td></tr>";
            return;
        }

        // Skapa tabellrader för varje erfarenhet
        data.forEach(item => {
            const row = document.createElement("tr");

            const startDate = item.startdate ? item.startdate.split("T")[0] : "";
            const endDate = item.enddate ? item.enddate.split("T")[0] : "Pågående";

            row.innerHTML = `
                <td>${item.companyname}</td>
                <td>${item.jobtitle}</td>
                <td>${item.location}</td>
                <td>${startDate} - ${endDate}</td>
                <td>${item.description}</td>
                <td><button onclick="deleteExperience(${item.id})">Radera</button></td>
            `;

            listContainer.appendChild(row);
        });

    } catch (error) {
        console.error("Fel:", error);
        errorElement.textContent = "Kunde inte ladda arbetserfarenheter. Kontrollera att API:et körs.";
    }
}

// Raderar en post (DELETE)
async function deleteExperience(id) {
    if (!confirm("Är du säker på att du vill radera denna post?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Gick inte att radera posten.");
        }

        // Ladda om listan efter att raderingen lyckats
        fetchExperiences();

    } catch (error) {
        console.error("Fel vid radering:", error);
        alert("Ett fel uppstod vid raderingen.");
    }
}