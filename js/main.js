// Byt ut adressen nedan till din publicerade Railway-URL vid drift
const API_URL = "https://dt207g-lab2-rest-api-production.up.railway.app/api/workexperience";

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
            listContainer.innerHTML = "<p>Inga arbetserfarenheter hittades.</p>";
            return;
        }

        // Skapa HTML för varje erfarenhet
        data.forEach(item => {
            const card = document.createElement("article");
            card.className = "card";

            const startDate = item.startdate ? item.startdate.split("T")[0] : "";
            const endDate = item.enddate ? item.enddate.split("T")[0] : "Pågående";

            card.innerHTML = `
                <h3>${item.jobtitle} – ${item.companyname}</h3>
                <p><strong>Plats:</strong> ${item.location}</p>
                <p><strong>Period:</strong> ${startDate} till ${endDate}</p>
                <p><strong>Beskrivning:</strong> ${item.description}</p>
                <button onclick="deleteExperience(${item.id})">Radera</button>
            `;

            listContainer.appendChild(card);
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