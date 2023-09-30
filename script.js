const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "002451757e9cc5352b12c6259bc48026";
let previousSearches = [];

function createWeatherCard(cityName, weatherItem, index) {
    if (index === 0) {
      return `
        <div class="details">
          <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
          <h4>Temperature: ${((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</h4>
          <h4>Wind: ${weatherItem.wind.speed}mph</h4>
          <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </div>
        <div class="icon">
          <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather-icon">
          <h4>${weatherItem.weather[0].description.toUpperCase()}</h4>
        </div>
      `;
    } else {
      return `
        <li class="card">
          <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
          <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png" alt="weather-icon">
          <h4>Temp: ${((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</h4>
          <h4>Wind: ${weatherItem.wind.speed}mph</h4>
          <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>
      `;
    }
  }

  function renderPreviousSearches() {
    const previousSearchesEl = document.getElementById("previous-searches");
    previousSearchesEl.innerHTML = "";
    previousSearches.forEach(search => {
      const listItemEl = document.createElement("li");
      listItemEl.textContent = search;
      previousSearchesEl.appendChild(listItemEl);
    });
  }
  
  function getWeatherDetails(cityName, lat, lon) {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    previousSearches.push(cityName);
    renderPreviousSearches();
    fetch(WEATHER_API_URL)
      .then(res => res.json())
      .then(data => {
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
          const forecastDate = new Date(forecast.dt_txt).getDate();
          if (!uniqueForecastDays.includes(forecastDate)) {
            uniqueForecastDays.push(forecastDate);
            return true;
          }
          return false;
        });
        fiveDaysForecast.forEach((weatherItem, index) => {
          if (index === 0) {
            currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
          } else {
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
          }
        });
      })
      .catch(() => {
        alert("An error occurred while fetching the weather forecast!");
      });
  }
  
  function getCityCoordinates() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
  
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          return alert(`No coordinates found for ${cityName}`);
        }
  
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
        savePreviousSearches();
      })
      .catch(() => {
        alert("An error occurred while fetching the coordinates!");
      });
  }
  
  function savePreviousSearches() {
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
  }
  
  function loadPreviousSearches() {
    const storedSearches = localStorage.getItem("previousSearches");
    if (storedSearches) {
      previousSearches = JSON.parse(storedSearches);
      renderPreviousSearches();
    }
  }
  
  searchBtn.addEventListener("click", getCityCoordinates);
  cityInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
      getCityCoordinates();
    }
  });
  
  loadPreviousSearches();
