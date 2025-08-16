document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const location = document.getElementById('locationInput').value;
    const apiKey = "586d1fb241184803b32104931251107";
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('weatherResult');
            if (data.error) {
                resultDiv.innerHTML = `<p style="color:red;">${data.error.message}</p>`;
            } else {
                // Hide input and button
                document.getElementById('locationInput').style.display = 'none';
                document.getElementById('getWeatherBtn').style.display = 'none';
                
                resultDiv.innerHTML = `
                    <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
                    <p><strong>Temperature:</strong> ${data.current.temp_c}°C</p>
                    <p><strong>Condition:</strong> ${data.current.condition.text}</p>
                    <img src="https:${data.current.condition.icon}" alt="Weather icon">
                    <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                    <p><strong>Wind:</strong> ${data.current.wind_kph} kph</p>
                `;
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p style="color:red;">Something went wrong. Please try again.</p>`;
        });
});
