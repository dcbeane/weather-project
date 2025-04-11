/// Weather App eval ///

// API key from OpenWeather //
const apiKey = "50db227b960d25c8fdefe35f9aa6496e";

// Grabs DOM elements //
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");

// Form submission handler //
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = input.value.trim();

  if (city !== "") {
    getWeather(city);
    getForecast(city);
  }
});

// Gets current weather data //
function getWeather(city) {
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === 200) {
        showWeather(data);
      } else {
        weatherDiv.innerHTML = "<p>City not found.</p>";
      }
    })
    .catch(function () {
      weatherDiv.innerHTML = "<p>Error getting weather.</p>";
    });
}

// Displays current weather //
function showWeather(data) {
  const temp = Math.round(data.main.temp);
  const city = data.name;
  const condition = data.weather[0].main;
  const icon = data.weather[0].icon;

  weatherDiv.innerHTML = `
    <h2>${temp}°F</h2>
    <h3>${city}</h3>
    <p>${condition}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" />
  `;
}

// Gets the 5-day forecast data //
function getForecast(city) {
  const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showForecast(data);
    })
    .catch(function () {
      forecastDiv.innerHTML = "<p>Error getting forecast.</p>";
    });
}

// Displays the 5-day forecast //
function showForecast(data) {
  forecastDiv.innerHTML = "";

  const forecastDays = {};

  for (let i = 0; i < data.list.length; i++) {
    const item = data.list[i];
    const dateTime = item.dt_txt;
    const date = dateTime.split(" ")[0];
    const time = dateTime.split(" ")[1];

    if (time === "12:00:00" && !forecastDays[date]) {
      forecastDays[date] = item;
    }
  }

  const dayList = Object.values(forecastDays).slice(0, 5);

  for (let j = 0; j < dayList.length; j++) {
    const forecast = dayList[j];
    const temp = Math.round(forecast.main.temp);
    const condition = forecast.weather[0].main;
    const icon = forecast.weather[0].icon;
    const day = new Date(forecast.dt_txt).toLocaleDateString("en-US", { weekday: "long" });

    const card = document.createElement("div");
    card.className = "card text-center m-2 p-3";

    card.innerHTML = `
      <div class="card-body">
        <h5>${condition}</h5>
        <p>${temp}°</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}" />
        <p><strong>${day}</strong></p>
      </div>
    `;

    forecastDiv.appendChild(card);
  }
}
