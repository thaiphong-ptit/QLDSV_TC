// api/axiosClient.js
import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "x-Powered-By": "Express",
    "content-type": "application/json; charset=utf-8",
    "access-Control-Allow-Headers":
      "authorization, Origin, Content-Type, Accept",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
