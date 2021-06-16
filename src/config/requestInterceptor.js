import axios from "axios";
import { BASE_URL } from "../constants/endpoint";

export const AXIOS_INSTANCE = axios.create({
  baseURL: BASE_URL,
});

export const doAxiosRequestIntercept = () => {
  AXIOS_INSTANCE.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("token");
    const mConfig = {
      ...config,
      headers: {
        "x-access-token": token,
      },
    };
    return mConfig;
  });
};
