import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    emailVerified?: boolean;
    authProvider?: "local" | "facebook" | "linkedin";
    role: "USER" | "ADMIN" | "SUPREME_ADMIN";
    isApproved: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (err) {
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            // Even if the request fails, clear client auth state.
        }
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
