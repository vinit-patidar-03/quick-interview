import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const generateAccessToken = (userId: string) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return accessToken;
}

export const generateRefreshToken = (userId: string) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET!, { expiresIn: '7d' });
    return refreshToken;
}

export const setCookies = async (key: string, value: string, maxAge: number) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge,
        path: "/",
    });
}

export const getCookies = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;
    const refreshToken = cookieStore.get("refreshToken")?.value || null;
    return `accessToken=${accessToken}; refreshToken=${refreshToken}`;
}


export const getAccessToken = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || null;
    return accessToken;
}

export const getRefreshToken = async () => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value || null;
    return refreshToken;
}

export const decodeAccessToken = (token: string) => {
    if (!token) return null;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return payload;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const decodeRefreshToken = (token: string) => {
    if (!token) return null;

    try {
        const payload = jwt.verify(token, process.env.REFRESH_JWT_SECRET!) as { userId: string };
        return payload;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

export const getUserId = async (key: string) => {

    const isAccess = key == 'access';
    const token = isAccess ? await getAccessToken() : await getRefreshToken();
    console.log(`${key} token:`, token);
    if (!token) {
        return null;
    }

    const decoded = isAccess ? decodeAccessToken(token)! : decodeRefreshToken(token);
    console.log(`${key} token decoded:`, decoded);
    if (!decoded) {
        return null;
    }
    return decoded?.userId;
}