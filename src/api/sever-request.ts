"use server";
import { getCookies } from "@/lib/session";
import axios, { AxiosError } from "axios";

export const apiRequestSSR = async (
  url: string,
  method: string,
  cookies: string
) => {
  try {
    const response = await axios({
      url,
      method,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      try {
        const refreshResponse = await axios.get(
          "http://localhost:3000/api/auth/refresh",
          {
            headers: {
              "Content-Type": "application/json",
              Cookie: cookies,
            },
          }
        );

        if (refreshResponse.status === 200 || refreshResponse.status === 201) {
          const newCookies =
            refreshResponse.headers["set-cookie"]?.join("; ") ??
            (await getCookies());

          const retryResponse = await axios({
            url,
            method,
            headers: {
              "Content-Type": "application/json",
              Cookie: newCookies,
            },
          });

          return retryResponse.data;
        } else {
          throw new Error("Session expired. Refresh failed.");
        }
      } catch (refreshError) {
        console.error("Refresh token request failed", refreshError);
        throw new Error("Session expired. Please login again.");
      }
    }

    console.error("API Request failed", axiosError.response?.status, axiosError.response?.data);
    throw error;
  }
};
