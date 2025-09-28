import { useState } from "react";
import "./App.css";

import sunnyImg from "./sunny.jpg";
import rainImg from "./rain.jpg";
import cloudyImg from "./cloudy.jpg";
import snowImg from "./snow.jpg";

function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "08fed09e26e04f7bbb7130830252809";

  const Submit = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    setError("");
    setLoading(true);
    setWeather(null);

    try {
      const ANS = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );

      if (!ANS.ok) throw new Error("City not found");

      const data = await ANS.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCategory = (condition) => {
    const text = condition.toLowerCase();

    if (text.includes("sunny") || text.includes("clear")) return "sunny";
    if (text.includes("rain") || text.includes("thunder")|| text.includes("cloudy")|| text.includes("partily cloudy")|| text.includes("drizzle")) return "rain";
    if (text.includes("snow") || text.includes("sleet") || text.includes("blizzard")) return "snow";
    return "cloudy";
  };

  const backgroundImage = weather
    ? {
        sunny: sunnyImg,
        rain: rainImg,
        cloudy: cloudyImg,
        snow: snowImg,
      }[getWeatherCategory(weather.current.condition.text)]
    : sunnyImg;

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="content">
        <h1>Weather Dashboard</h1>
        <form onSubmit={Submit}>
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Find the weather</button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading please wait...</p>}

        {weather && (
          <div className="weather">
            <h2>
              {weather.location.name}, {weather.location.country}
            </h2>
            <p>🌡 {weather.current.temp_c}°C</p>
            <p>{weather.current.condition.text}</p>
            <img
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
