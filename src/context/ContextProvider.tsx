"use client"
import React, { useState, ReactNode, useEffect } from 'react';
import context, { User } from './Context';
import { apiRequest } from '@/api/request';

interface ContextProviderProps {
    children: ReactNode;
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        try {
            const response = await apiRequest('/api/auth/me', 'GET');
            setUser(response?.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <context.Provider value={{ user, setUser }}>
            {children}
        </context.Provider>
    );
};

export default ContextProvider;
