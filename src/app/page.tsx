"use client";
import { weatherServices } from "@/services/weatherservice";
import { useEffect, useState } from "react";
import { X, Star, Sun, Moon } from "lucide-react";

export default function Home() {
  const [searchedWeathers, setSearchedWeathers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [favoriteCity, setFavoriteCity] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const storedFav = localStorage.getItem("favoriteCity");
    const storedTheme = localStorage.getItem("theme");
    if (storedFav) {
      setFavoriteCity(storedFav);
      handleWeather(storedFav);
    }
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const city = (e.target as any).city.value;
    handleWeather(city);
    (e.target as any).reset();
  };

  const handleWeather = async (city: string) => {
    try {
      const res = await weatherServices.getWeatherByCity(city);
      const forecast = await weatherServices.getForecastByCity(city);
      if (res) {
        const weatherWithForecast = { ...res, forecast };
        setSearchedWeathers((prevArray) => {
          const updated = prevArray.filter(
            (w) => w.name.toLowerCase() !== res.name.toLowerCase()
          );
          return [...updated, weatherWithForecast];
        });
        setErrorMessage("");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage("City not found. Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    }
  };

  const handleDelete = (index: number) => {
    index = searchedWeathers.length - index - 1;
    setSearchedWeathers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFavorite = (cityName: string) => {
    if (favoriteCity?.toLowerCase() === cityName.toLowerCase()) {
      setFavoriteCity(null);
      localStorage.removeItem("favoriteCity");
    } else {
      setFavoriteCity(cityName);
      localStorage.setItem("favoriteCity", cityName);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-10 px-5 transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-r from-indigo-900 via-blue-900 to-gray-900 text-white"
          : "bg-gradient-to-r from-indigo-200 via-blue-200 to-gray-100 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between w-full max-w-6xl mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center flex-1">
          🌤️ QuickWeather
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex w-full max-w-md gap-2 mb-6 backdrop-blur-md rounded-2xl p-3 shadow-lg ${
          darkMode ? "bg-white/10" : "bg-white/50"
        }`}
      >
        <input
          type="text"
          placeholder="Enter city name..."
          name="city"
          className={`flex-1 bg-transparent border-none focus:outline-none px-2 ${
            darkMode ? "text-white placeholder-gray-300" : "text-gray-900 placeholder-gray-700"
          }`}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold px-5 py-2 rounded-xl shadow-md"
        >
          Search
        </button>
      </form>

      {errorMessage && (
        <p className={`${darkMode ? "text-red-400" : "text-red-600"} mb-4`}>
          {errorMessage}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {[...searchedWeathers].reverse().map((weather, index) => (
          <div
            key={index}
            className={`relative rounded-2xl p-6 shadow-lg border hover:scale-105 transition-transform ${
              darkMode
                ? "bg-white/10 border-white/20 backdrop-blur-xl"
                : "bg-white/80 border-gray-300"
            }`}
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => handleFavorite(weather.name)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                <Star
                  size={20}
                  className={`${
                    favoriteCity?.toLowerCase() === weather.name.toLowerCase()
                      ? "text-yellow-400"
                      : darkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                <X
                  size={20}
                  className={darkMode ? "text-gray-300" : "text-gray-700"}
                />
              </button>
            </div>

            <h2 className="text-xl font-bold mb-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className={`mb-3 capitalize ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
              {weather.weather[0].description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-14 h-14"
              />
              <p className="text-3xl font-semibold">{Math.round(weather.main.temp)}°C</p>
            </div>

            <div className={`text-sm space-y-1 mb-4 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              <p>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>🌬️ Wind: {weather.wind.speed} m/s</p>
            </div>

            {weather.forecast && (
              <div className="mt-4 border-t pt-3" style={{ borderColor: darkMode ? "rgba(255,255,255,0.2)" : "#ccc" }}>
                <h3 className="text-sm font-semibold mb-2">5-Day Forecast</h3>
                <div className="space-y-2">
                  {weather.forecast.map((day: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-sm ${
                        darkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      <span>
                        {idx === 0
                          ? "Today"
                          : new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                      </span>
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                          alt={day.description}
                          className="w-6 h-6"
                        />
                        <span>{day.temp}°C</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
