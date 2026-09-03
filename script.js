const API_KEY = "2fd0c21c2369d1c75002d4c5b4501a68";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const result = document.getElementById("weatherResult");
    const forecast = document.getElementById("forecast");

    if (city === "") {
        result.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    try {

        const currentURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const currentResponse = await fetch(currentURL);
        const currentData = await currentResponse.json();

        if (!currentResponse.ok) {
            throw new Error(currentData.message);
        }

        result.innerHTML = `
            <h2>${currentData.name}, ${currentData.sys.country}</h2>
            <h3>🌡️ ${Math.round(currentData.main.temp)}°C</h3>
            <p>🌤️ ${currentData.weather[0].description}</p>
            <p>💧 Humidity: ${currentData.main.humidity}%</p>
            <p>💨 Wind: ${currentData.wind.speed} m/s</p>
            <p>🌡️ Feels Like: ${Math.round(currentData.main.feels_like)}°C</p>
        `;

        const forecastResponse = await fetch(forecastURL);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(forecastData.message);
        }

        let cards = "";

        for (let i = 0; i < forecastData.list.length; i += 8) {

            const item = forecastData.list[i];

            const date = new Date(item.dt * 1000)
                .toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                });

            cards += `
                <div class="forecast-card">
                    <strong>${date}</strong>
                    <p>🌡️ ${Math.round(item.main.temp)}°C</p>
                    <p>☁️ ${item.weather[0].description}</p>
                    <p>💧 ${item.main.humidity}%</p>
                </div>
            `;
        }

        forecast.innerHTML = `
            <h2 class="forecast-title">📅 5 Days Forecast</h2>
            <div class="forecast-container">
                ${cards}
            </div>
        `;

    } catch (error) {

        result.innerHTML = `<p>❌ ${error.message}</p>`;
        forecast.innerHTML = "";
    }
}