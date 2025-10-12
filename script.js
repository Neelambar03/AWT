// Time and Greeting Update
function updateDateTime() {
  const now = new Date();

  const dateStr = now.toDateString();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;

  let greeting = "";
  if (now.getHours() < 12) greeting = "🌞 Good Morning!";
  else if (now.getHours() < 18) greeting = "🌤️ Good Afternoon!";
  else if (now.getHours() < 21) greeting = "🌆 Good Evening!";
  else greeting = "🌙 Good Night!";

  document.getElementById("datetime").innerHTML = `
    ${dateStr} | ${timeStr}<br><span>${greeting}</span>
  `;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Weather Info Setup
const getWeatherBtn = document.getElementById('getWeatherBtn');

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Drizzle: Light",
  53: "Drizzle: Moderate",
  55: "Drizzle: Dense",
  56: "Freezing Drizzle: Light",
  57: "Freezing Drizzle: Dense",
  61: "Rain: Slight",
  63: "Rain: Moderate",
  65: "Rain: Heavy",
  66: "Freezing Rain: Light",
  67: "Freezing Rain: Heavy",
  71: "Snow: Slight",
  73: "Snow: Moderate",
  75: "Snow: Heavy",
  77: "Snow grains",
  80: "Rain showers: Slight",
  81: "Rain showers: Moderate",
  82: "Rain showers: Violent",
  85: "Snow showers: Slight",
  86: "Snow showers: Heavy",
  95: "Thunderstorm: Slight or moderate",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

async function reverseGeocode(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  const data = await response.json();
  return data.address;
}

async function fetchWeather(lat, lon) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
  const data = await response.json();
  return data.current_weather;
}

getWeatherBtn.addEventListener('click', () => {
  getWeatherBtn.disabled = true;
  getWeatherBtn.textContent = "⏳ Loading...";

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    getWeatherBtn.disabled = false;
    getWeatherBtn.textContent = "📍 Get My Weather & Location";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude.toFixed(5);
    const lon = position.coords.longitude.toFixed(5);
    document.getElementById("coordinates").textContent = `Lat: ${lat} | Lon: ${lon}`;

    try {
      const address = await reverseGeocode(lat, lon);
      const addressParts = [
        address.house_number,
        address.road,
        address.neighbourhood,
        address.suburb,
        address.city || address.town || address.village,
        address.county,
        address.state,
        address.postcode,
        address.country
      ];

      const fullAddress = addressParts.filter(Boolean).join(', ');
      document.getElementById("location").textContent = fullAddress || "Unknown location";

      const weather = await fetchWeather(lat, lon);

      document.getElementById("temperature").textContent = `${weather.temperature}°C`;
      document.getElementById("condition").textContent = weatherDescriptions[weather.weathercode] || 'Unknown';
      document.getElementById("wind").textContent = `${weather.windspeed} km/h`;

    } catch (error) {
      document.getElementById("location").textContent = "⚠️ Error fetching data.";
      console.error(error);
    } finally {
      getWeatherBtn.disabled = false;
      getWeatherBtn.textContent = "📍 Get My Weather & Location";
    }

  }, (error) => {
    alert(`Geolocation error: ${error.message}`);
    getWeatherBtn.disabled = false;
    getWeatherBtn.textContent = "📍 Get My Weather & Location";
  });
});
