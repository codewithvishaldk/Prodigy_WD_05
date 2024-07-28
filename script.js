const apiKey = '4389ec53a9c145efbe8bb9bc9339aa28';

document.addEventListener('DOMContentLoaded', () => {
    setGreeting();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherByLocation, handleLocationError);
    } else {
        alert('Geolocation is not supported by your browser.');
    }

    const modeSwitch = document.getElementById('modeSwitch');
    modeSwitch.addEventListener('change', toggleDarkMode);
});

function setGreeting() {
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    if (hour < 12) {
        greeting.innerText = 'Good Morning!';
    } else if (hour < 18) {
        greeting.innerText = 'Good Afternoon!';
    } else {
        greeting.innerText = 'Good Night!';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

async function fetchWeather() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${location}&key=${apiKey}`);
        const data = await response.json();
        displayWeather(data);

        const forecastResponse = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&key=${apiKey}&days=7`);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } else {
        alert('Please enter a location.');
    }
}

async function fetchWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;
    const response = await fetch(`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
    const data = await response.json();
    displayWeather(data);

    const forecastResponse = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&days=7`);
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);
}

function handleLocationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    if (data && data.data && data.data.length > 0) {
        const weather = data.data[0];
        weatherInfo.innerHTML = `
            <h2>${weather.city_name}, ${weather.country_code}</h2>
            <p>Temperature: ${weather.temp}°C</p>
            <p>Weather: ${weather.weather.description}</p>
            <p>Humidity: ${weather.rh}%</p>
            <p>Wind Speed: ${weather.wind_spd} m/s</p>
        `;
    } else {
        weatherInfo.innerHTML = '<p>No weather data found for the given location.</p>';
    }
}

function displayForecast(data) {
    const forecastElement = document.getElementById('forecast');
    if (data && data.data && data.data.length > 0) {
        forecastElement.innerHTML = '';
        data.data.forEach((day, index) => {
            if (index === 0) return; // Skip today's weather
            const date = new Date(day.datetime);
            const options = { weekday: 'long', month: 'short', day: 'numeric' };
            forecastElement.innerHTML += `
                <div class="forecast-day">
                    <p>${date.toLocaleDateString(undefined, options)}</p>
                    <p>Temperature: ${day.temp}°C</p>
                    <p>Weather: ${day.weather.description}</p>
                </div>
            `;
        });
    } else {
        forecastElement.innerHTML = '<p>No forecast data found for the given location.</p>';
    }
}
