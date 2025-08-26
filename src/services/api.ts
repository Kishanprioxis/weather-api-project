// import axios from "axios";
// const api = axios.create({
//     baseURL : process.env.base_url || "https://api.restful-api.dev" ,
//     timeout : 10000,
//     headers:{
//         "Content-Type":"application/json"
//     },
//     })

import axios from "axios";

// api.interceptors.request.use(
//     (confing) =>{
//         return confing;
//     },
    
//     (error)=>Promise.reject(error)
// )

// api.interceptors.response.use(
//     (response) => response,
//     (error) =>{
//         console.error("API Error:",error)
        
//         return Promise.reject(error);
//     }
// );

// export default api;

const apiClient =axios.create({
    baseURL:process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://api.openweathermap.org/data/2.5",
    headers:{"Content-Type":"application/json"}
})
export default apiClient;