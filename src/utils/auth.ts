import { apiRequestSSR } from "@/api/sever-request";
import { getCookies } from "@/lib/session"

export const getUser = async () => {
    try {
        const cookies = await getCookies();
        const response = await apiRequestSSR(`${process.env.INTERVIEW_URL}/api/auth/me`, "GET", cookies);
        return response?.data;
    } catch (error) {
        console.error(error)
    }
}