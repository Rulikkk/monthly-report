import axios from "axios";

export let http = axios.create({ baseURL: "http://localhost:9292/v1" });
