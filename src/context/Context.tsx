import { createContext, Dispatch, SetStateAction } from 'react';

export type User = {
    username: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

const context = createContext<UserContextType>({
    user: null,
    setUser: () => { }
});

export default context;
