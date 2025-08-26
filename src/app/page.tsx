/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { weatherServices } from "@/services/weatherservice";
import { useEffect, useState } from "react";
import { X, Star } from "lucide-react";

export default function Home() {
  const [searchedWeathers, setSearchedWeathers] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [favoriteCity, setFavoriteCity] = useState<string | null>(null);

  useEffect(() => {
    const storedFav = localStorage.getItem("favoriteCity");
    if (storedFav) {
      setFavoriteCity(storedFav);
      handleWeather(storedFav);
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-blue-900 to-gray-900 text-white flex flex-col items-center py-10 px-5">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">
        🌤️ QuickWeather
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md gap-2 mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-3 shadow-lg"
      >
        <input
          type="text"
          placeholder="Enter city name..."
          name="city"
          className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-300 px-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold px-5 py-2 rounded-xl shadow-md"
        >
          Search
        </button>
      </form>

      {errorMessage && (
        <p className="text-red-400 mb-4">{errorMessage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {[...searchedWeathers].reverse().map((weather, index) => (
          <div
            key={index}
            className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:scale-105 transition-transform"
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
                      : "text-gray-300"
                  }`}
                />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            <h2 className="text-xl font-bold mb-2">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-gray-300 capitalize mb-3">
              {weather.weather[0].description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="w-14 h-14"
              />
              <p className="text-3xl font-semibold">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>

            <div className="text-sm space-y-1 text-gray-200 mb-4">
              <p>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>🌬️ Wind: {weather.wind.speed} m/s</p>
            </div>

            {weather.forecast && (
              <div className="mt-4 border-t border-white/20 pt-3">
                <h3 className="text-sm font-semibold mb-2">5-Day Forecast</h3>
                <div className="space-y-2">
                  {weather.forecast.map((day: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
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
