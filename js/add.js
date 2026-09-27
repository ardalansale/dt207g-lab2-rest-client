const API_URL = "https://dt207g-lab2-rest-api-production.up.railway.app/api/workexperience";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-experience-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const errorElement = document.getElementById("error-message");
        const successElement = document.getElementById("success-message");

        // Rensa tidigare meddelanden
        errorElement.textContent = "";
        successElement.textContent = "";

        // Hämta värden från formuläret
        const companyname = document.getElementById("companyname").value.trim();
        const jobtitle = document.getElementById("jobtitle").value.trim();
        const location = document.getElementById("location").value.trim();
        const startdate = document.getElementById("startdate").value;
        const enddate = document.getElementById("enddate").value;
        const description = document.getElementById("description").value.trim();

        // Klientvalidering (Obligatoriskt i kurskraven)
        let errors = [];

        if (!companyname) errors.push("Företagsnamn måste fyllas i.");
        if (!jobtitle) errors.push("Befattning/Titel måste fyllas i.");
        if (!location) errors.push("Plats måste fyllas i.");
        if (!startdate) errors.push("Startdatum måste fyllas i.");
        if (!description) errors.push("Beskrivning måste fyllas i.");

        if (errors.length > 0) {
            errorElement.innerHTML = errors.join("<br>");
            return;
        }

        // Bygg objektet som ska skickas
        const newExperience = {
            companyname,
            jobtitle,
            location,
            startdate,
            enddate: enddate ? enddate : null,
            description
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newExperience)
            });

            const data = await response.json();

            if (!response.ok) {
                // Om servern returnerade valideringsfel (t.ex. 400 Bad Request)
                throw new Error(data.error || "Det gick inte att spara arbetserfarenheten.");
            }

            // Återställ formuläret och visa bekräftelse
            successElement.textContent = "Arbetserfarenheten har sparats!";
            form.reset();

        } catch (error) {
            console.error("Fel vid sparning:", error);
            errorElement.textContent = error.message;
        }
    });
});