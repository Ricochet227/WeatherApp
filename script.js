const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "002451757e9cc5352b12c6259bc48026";
let previousSearches = [];

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

function createWeatherCard(cityName, weatherItem, index) {
  if (index === 0) {
    return `
      <div class="details">
        <h2>${cityName} (${formatDate(weatherItem.dt_txt)})</h2>
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
        <h3>(${formatDate(weatherItem.dt_txt)})</h3>
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
    const uniqueSearches = [...new Set(previousSearches)]; // Remove duplicates
    uniqueSearches.forEach(search => {
      const listItemEl = document.createElement("li");
      listItemEl.textContent = search;
      listItemEl.addEventListener("click", () => {
        cityInput.value = search;
        getCityCoordinates();
      });
      previousSearchesEl.appendChild(listItemEl);
    });
  }
  
  function getWeatherDetails(cityName, lat, lon) {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
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
  
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          return alert(`No coordinates found for ${cityName}`);
        }
  
        const { name, lat, lon } = data[0];
        previousSearches.push(name);
        savePreviousSearches();
        getWeatherDetails(name, lat, lon);
        renderPreviousSearches();
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
