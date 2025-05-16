import axios from "axios";
import { enqueueSnackbar } from "notistack";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const supplierId =
    typeof window !== "undefined" ? localStorage.getItem("supplierId") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (role === "supplier" && supplierId) {
    config.headers["x-supplier-id"] = supplierId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {
              refreshToken: refreshToken,
            }
          );
          localStorage.setItem("accessToken", res.data.accessToken);
          error.config.headers[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;
          return api(error.config);
        } catch (_refreshError) {
          enqueueSnackbar("Сессия истекла", { variant: "error" });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          localStorage.removeItem("supplierId");
          window.location.href = "/";
        }
      }
    }
    enqueueSnackbar(error.response?.data?.errorMessage || "Произошла ошибка", {
      variant: "error",
    });
    return Promise.reject(error);
  }
);

export default api;
