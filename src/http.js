import axios from "axios";

export const baseUrl = "https://pokeapi.co/api/v2/";
const http = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: "Basic ZmF5YXF1bjpzYXRyaWE=",
    "Content-Type": "application/json",
  },
});

export default http;
