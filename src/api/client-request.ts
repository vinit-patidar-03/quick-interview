import axios, { AxiosError } from "axios";

export const apiRequest = async (
    url: string,
    method: string,
    data: unknown = null
) => {
    try {
        const response = await axios({
            url,
            method,
            data,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            try {
                const refreshResponse = await axios.get("/api/auth/refresh", {
                    withCredentials: true,
                });

                if (refreshResponse.status === 201 || refreshResponse.status === 200) {
                    const retryResponse = await axios({
                        url,
                        method,
                        data,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    });

                    return retryResponse.data;
                } else {
                    throw new Error("Session expired. Refresh failed.");
                }
            } catch (refreshError) {
                console.error("Refresh token request failed", refreshError);
            }
        }
    }
};

export const apiRequestWithFile = async (
    url: string,
    method: string,
    formData: unknown
) => {
    try {
        const response = await axios({
            url,
            method,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
            try {
                const refreshResponse = await axios.get("/api/auth/refresh", {
                    withCredentials: true,
                });

                if (refreshResponse.status === 200 || refreshResponse.status === 201) {
                    const retryResponse = await axios({
                        url,
                        method,
                        data: formData,
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
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

        throw error;
    }
};