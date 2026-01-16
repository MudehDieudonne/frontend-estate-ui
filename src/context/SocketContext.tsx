import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (user && socket) {
            socket.emit("newUser", user.id);
        }
    }, [user, socket]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
