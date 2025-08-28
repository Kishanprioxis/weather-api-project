"use client";
import { useEffect, useState } from "react";
import { weatherServices } from "@/services/weatherservice";

export default function Home() {
  const [searchedWeathers, setSearchedWeathers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [favoriteCity, setFavoriteCity] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 17) {
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }

    const savedFav = localStorage.getItem("favoriteCity");
    if (savedFav) {
      setFavoriteCity(savedFav);
      handleWeather(savedFav);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const city = e.target.city.value;
    handleWeather(city);
    e.target.reset();
  };

  const handleWeather = async (city: string) => {
    try {
      const res = await weatherServices.getWeatherByCity(city);
      const forecast = await weatherServices.getForecastByCity(city);

      if (res) {
        const newWeather = { ...res, forecast };

        const withoutOld = searchedWeathers.filter(
          (w) => w.name.toLowerCase() !== res.name.toLowerCase()
        );

        setSearchedWeathers([...withoutOld, newWeather]);
        setErrorMessage("");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setErrorMessage("City not found. Try again.");
      } else {
        setErrorMessage("Something went wrong. Try again later.");
      }
    }
  };

  const handleDelete = (index: number) => {
    const copy = [...searchedWeathers];
    copy.splice(index, 1);
    setSearchedWeathers(copy);
  };

  const handleFavorite = (city: string) => {
    if (favoriteCity?.toLowerCase() === city.toLowerCase()) {
      setFavoriteCity(null);
      localStorage.removeItem("favoriteCity");
    } else {
      setFavoriteCity(city);
      localStorage.setItem("favoriteCity", city);
    }
  };

  return (
    <div
      className={
        darkMode
          ? "bg-black text-white min-h-screen p-6"
          : "bg-white text-black min-h-screen p-6"
      }
    >
      <h1 className="text-2xl font-bold mb-4">Weather App</h1>

      <button
        onClick={toggleTheme}
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
      >
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="city"
          placeholder="Enter city"
          className="border px-2 py-1 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </form>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div>
        {searchedWeathers.map((weather, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <button
              onClick={() => handleFavorite(weather.name)}
              className="mr-2 text-yellow-500"
            >
              {favoriteCity?.toLowerCase() === weather.name.toLowerCase()
                ? "★ Unfavorite"
                : "☆ Favorite"}
            </button>

            <button
              onClick={() => handleDelete(index)}
              className="text-red-500"
            >
              Delete
            </button>

            <h2 className="text-lg font-bold">
              {weather.name}, {weather.sys.country}
            </h2>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} className="w-12 h-12" />
            <p>{weather.weather[0].description}</p>

            <p className="text-xl">{Math.round(weather.main.temp)}°C</p>
            <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} m/s</p>

            {weather.forecast && (
              <div className="mt-2">
                <h3 className="font-semibold">5-Day Forecast</h3>
                {weather.forecast.map((day: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{new Date(day.date).toLocaleDateString()}</span>
                    <span>{day.temp}°C</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
