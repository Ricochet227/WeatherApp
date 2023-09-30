var previousSearches = [];
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "002451757e9cc5352b12c6259bc48026";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</h4>
                    <h4>Wind: ${weatherItem.wind.speed}mph</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description.toUpperCase()}</h4>
                </div>`
    }else{
    return`<li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temp: ${((weatherItem.main.temp - 273.15) * 9/5 + 32).toFixed(2)}°F</h4>
            <h4>Wind: ${weatherItem.wind.speed}mph</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`
    }

}

function renderPreviousSearches() {
    var previousSearchesEl = document.getElementById("previous-searches");
    previousSearchesEl.innerHTML = "";
    for (var i = 0; i < previousSearches.length; i++) {
      var listItemEl = document.createElement("li");
      listItemEl.textContent = previousSearches[i];
      previousSearchesEl.appendChild(listItemEl);
    }
  }

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    previousSearches.push(cityName);
    renderPreviousSearches();
    
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = []
        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate()
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML= "";
        weatherCardsDiv.innerHTML= "";

        console.log(fiveDaysForecast)
        fiveDaysForecast.forEach((weatherItem, index)=> {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index))
            }
        })
    }).catch(() => {
        alert("An error occurred while fethcing the weather forecast!")
      })
}

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

  fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    if(!data.length) return alert(`No coordinates found for ${cityName}`)
    const{ name, lat, lon } = data[0];
    getWeatherDetails(name, lat, lon);
  }).catch(() => {
    alert("An error occurred while fethcing the coordinates!")
  })
}

searchBtn.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates())