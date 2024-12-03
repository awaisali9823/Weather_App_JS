let cityInput = document.querySelector(".city-input");
let searchBtn = document.querySelector(".search-btn");
let notFound = document.querySelector(".not-found");
let searchCity = document.querySelector(".city-searched");
let weatherInfo = document.querySelector(".weather-info");
let cityName = document.querySelector(".country-text");
let tempText = document.querySelector(".temp-text");
let condition = document.querySelector(".condition-text");
let humidityText = document.querySelector(".humidity-text");
let windSpeed = document.querySelector(".wind-text");
let weatherImg = document.querySelector(".weather-img");
let date = document.querySelector(".current-date");
let forecastContainer = document.querySelector(".forecast-container");
// let forecastInfo = document.querySelector(".forecast-info");
const apiKey = "b5dbae50156b5841d7dd4d53c3d405b0";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

async function fetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherData = await fetchData("weather", city);
  if (weatherData.cod !== 200) {
    showDisplay(notFound);
  }
  // else {
  //   cityName.textContent = weatherData.name;
  //   temp.textContent = `${Math.ceil(weatherData.main.temp)} °C`;
  //   humidity.textContent = `${weatherData.main.humidity} %`;
  //   wind.textContent = `${weatherData.wind.speed} km/h`;
  //   showDisplay(weatherInfo);
  // }
  // console.log(weatherData);
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;
  date.textContent = getCurrentDate();
  cityName.textContent = country;
  tempText.textContent = `${Math.round(temp)} °C`;
  humidityText.textContent = `${humidity} %`;
  condition.textContent = `${main}`;
  windSpeed.textContent = `${speed} km/h`;
  weatherImg.src = `assets/weather/${main}.svg`;
  await updateForecast(city);
  showDisplay(weatherInfo);
}
async function updateForecast(city) {
  const forecastData = await fetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastData(forecastWeather);
    }
  });
  console.log(forecastData);
}

function updateForecastData(weatherData) {
  const {
    dt_txt: date,
    weather: [{ main }],
    main: { temp },
  } = weatherData;

  const currentDate = new Date(date);
  const options = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = currentDate.toLocaleDateString("en-US", options);

  const forecastItem = `
            <div class="forecast-info">
            <h5 class="forecast-info-date regular-text">${dateResult}</h5>
            <img src="assets/weather/${main}.svg" alt="" />
            <h5 class="forecast-info-temp">${Math.round(temp)} °C</h5>
          </div>`;
  forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplay(section) {
  [weatherInfo, searchCity, notFound].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "block";
}
