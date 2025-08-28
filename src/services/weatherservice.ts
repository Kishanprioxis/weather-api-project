/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import apiClient from "./api";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export const weatherServices = {
  getWeatherByCity: async (city: string): Promise<any> => {
    const res = await apiClient.get(
      `/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    console.log(res)
    return res.data;
  },

  getForecastByCity: async (city: string): Promise<any[]> => {
    const res = await apiClient.get(
      `/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = res.data;
    const dailyForecast: any[] = [];
    const processedDates = new Set();
    const today = new Date().toISOString().split("T")[0];
    console.log(forecastData)
    forecastData.list.forEach((entry: any) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!processedDates.has(date) && date !== today) {
        console.log(entry)
        processedDates.add(date);
        dailyForecast.push({
          date: date,
          temp: Math.round(entry.main.temp),
          weather: entry.weather[0].main,
          description: entry.weather[0].description,
          icon: entry.weather[0].icon,
        });
      }
    });
    return dailyForecast;
  },
};
