async function generateMission() {

    const mood = document.getElementById("mood").value;
    const time = document.getElementById("time").value;
    const budget = document.getElementById("budget").value;
    const people = document.getElementById("people").value;

    const result = document.getElementById("result");

    result.innerHTML = "🤖 Creating your outdoor mission...";

    const question = `
Create a personalized outdoor mission.

Mood: ${mood}
Available time: ${time}
Budget: ${budget}
People: ${people}

Make the activity realistic, safe and suitable for these conditions.
`;

    try {

        const response = await fetch("http://127.0.0.1:5050/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (data.error) {
            result.innerHTML = `❌ ${data.error}`;
            return;
        }

        result.innerHTML = `
            <div class="ai-result">

                <h2>🌱 ${data.activity}</h2>

                <div class="info-grid">

                    <div class="info-item">
                        <span>⏱️</span>
                        <strong>Duration</strong>
                        <p>${data.duration}</p>
                    </div>

                    <div class="info-item">
                        <span>💰</span>
                        <strong>Budget</strong>
                        <p>${data.budget}</p>
                    </div>

                    <div class="info-item">
                        <span>👥</span>
                        <strong>People</strong>
                        <p>${data.people}</p>
                    </div>

                    <div class="info-item">
                        <span>📍</span>
                        <strong>Where</strong>
                        <p>${data.where}</p>
                    </div>

                </div>

                <div class="why">
                    <h3>💡 Why?</h3>
                    <p>${data.why}</p>
                </div>

                <div class="challenge">
                    <h3>📵 Outdoor Challenge</h3>
                    <p>${data.challenge}</p>
                </div>

                <div class="plan">
                    <h3>🚶 Mission Plan</h3>
                    <ol>
                        ${data.plan.map(step => `<li>${step}</li>`).join("")}
                    </ol>
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "❌ AI server se connection nahi ho pa raha.";
    }
}