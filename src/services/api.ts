import axios from "axios";
const apiClient =axios.create({
    baseURL:process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.openweathermap.org/data/2.5",
    headers:{"Content-Type":"application/json"}
})
export default apiClient;