const searchButton = document.getElementById("searchButton")
const cityInput = document.getElementById("cityInput")
const weatherIcon = document.querySelector(".weather-icon")
const tempElement = document.querySelector(".temp")
const cityElement = document.querySelector(".city")
const dayDateElement = document.querySelector(".day-date")
const humidityElement = document.querySelector(".humidity")
const windElement = document.querySelector(".wind")
const pressureElement = document.querySelector(".pressure")

searchButton.addEventListener("click", function (event) {
  event.preventDefault() // Prevent form submission

  const city = cityInput.value.trim().toLowerCase()

  if (city === "") {
    // Display an error message when the city name is not provided
    updateWeatherDisplay("<p>Please enter a city name.</p>")
    return
  }
  fetchData(city)
})

function fetchData(city = "rewa") {
  // Send a request to the OpenWeatherMap API
  fetch(`fetch_weather.php?city=${city}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      // Update the UI with the received data
      updateWeatherDisplay(data)
    })
    .catch((error) => {
      console.error("Fetch Error:", error)
      updateWeatherDisplay(
        "<p>Error fetching weather data. Please try again later.</p>"
      )
    })
}

fetchData()

function updateWeatherDisplay(data) {
  if (data && data.main) {
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    tempElement.textContent = `${Math.round(data.main.temp)} °C`
    cityElement.textContent = data.name
    dayDateElement.textContent = new Date().toLocaleDateString()
    humidityElement.textContent = `${data.main.humidity}%`
    windElement.textContent = `${data.wind.speed} km/h`
    pressureElement.textContent = `${data.main.pressure} hPa`
  } else {
    // Display an error message if data is not available
    tempElement.textContent = "N/A"
    updateWeatherDisplay("<p>No data available for the specified city.</p>")
  }
}
async function getPastData() {
  try {
    const response = await fetch("get_past_data.php")
    const data = await response.json()

    console.log(data)

    if (data.length == 0) {
      const divs1 = document.querySelectorAll(".past-data-1 div")
      divs1.forEach((div, i) => {
        div.innerHTML = `<p>No</p><p>Data</p><p>Available</p>`
      })

      const divs2 = document.querySelectorAll(".past-data-2 div")
      divs2.forEach((div, i) => {
        div.innerHTML = `<p>No</p><p>Data</p><p>Available</p></p>`
      })
    } else {
      const divs1 = document.querySelectorAll(".past-data-1 div")
      divs1.forEach((div, i) => {
        div.innerHTML = `<p>Date:${data[i].timestamp} City: ${data[i].city}</p><p>Temp: ${data[i].temperature}</p><p>Humidity: ${data[i].humidity}%</p>`
      })

      const divs2 = document.querySelectorAll(".past-data-2 div")
      divs2.forEach((div, i) => {
        div.innerHTML = `<p>Date:${data[i].timestamp} City: ${data[i + divs1.length].city}</p><p>Temp: ${data[i + divs1.length].temperature}</p><p>Humidity: ${data[i + divs1.length].humidity}%</p>`
      })
    }
  } catch (error) {
    console.error("Fetch Error:", error)
  }
}

getPastData()
