const api_key = "1317249270a455c3d5cb904f523c501f";
const api_url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const fiveDayWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const searchBox = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkweather(city) {
    const response = await fetch(api_url + city + `&appid=${api_key}`);
    const data = await response.json();

    if (response.status == 404) {
        alert("Invalid City Name!");
    } else {
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        document.querySelector(".weather").style.display = "block";
    }
}
//function for next seven days forecast
async function fivedaysforecast(city) {
    const response = await fetch(fiveDayWeatherUrl + city + `&appid=${api_key}`);
    const data = await response.json();

    const forecastContainer = document.querySelector(".forecast");

    forecastContainer.innerHTML = "<h1>Next Five Days Forecast</h1>"; // Clear previous forecast data

    const currentDate = new Date();
    const currentDayIndex = currentDate.getDay();
    let daysForecasted = 0;

    data.list.forEach(dayData => {
        const date = new Date(dayData.dt * 1000); // Convert timestamp to Date object

        // Only consider forecasts for the next five days
        if (date.getDate() !== currentDate.getDate() && daysForecasted < 7) {
            const dayIndex = (currentDayIndex + daysForecasted + 1) % 7; // Get the day index for the forecasted day
            const dayName = getDayName(dayIndex);
            const temp = Math.round(dayData.main.temp - 273.15) + "°C"; // Convert from Kelvin to Celsius
            const weather = dayData.weather[0].main;
            const icon = getWeatherIcon(weather);

            const forecastItem = document.createElement("div");
            forecastItem.classList.add("day");
            forecastItem.innerHTML = `
                <h3>${dayName}</h3>
                <img src="${icon}" alt="${weather}">
                <h4>${weather}</h4>
                <p class="temperature">${temp}</p>
            `;
            forecastContainer.appendChild(forecastItem);

            daysForecasted++;
        }
    });
}
//Adding Key pressed event on search button
document.body.addEventListener("keypress", function(event) {
    // Check if the pressed key is Enter (keyCode 13)
    if (event.keyCode === 13 || event.which === 13) {
        // Check if the currently focused element is the search input field
        if (document.activeElement === searchBox) {
            // Trigger the search functionality
            const city = searchBox.value;
            checkweather(city);
            fivedaysforecast(city);
        }
    }
});


// Function to get the day name dynamically
function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex % 7];
}

// Function to get the weather icon
function getWeatherIcon(weather) {
    switch (weather) {
        case "Clear":
            return "images/clear.png";
        case "Clouds":
            return "images/clouds.png";
        case "Rain":
        case "Drizzle":
            return "images/rain.png";
        case "Mist":
            return "images/mist.png";
        default:
            return "images/default.png";
    }
}

searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    checkweather(city);
    fivedaysforecast(city); // Call the forecast function when searching for a city
});
