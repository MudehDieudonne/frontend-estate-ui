import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedChatId: string | null;
    setSelectedChatId: (id: string | null) => void;
    openChatWith: (receiverId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const openChatWith = async (receiverId: string) => {
        // This is a placeholder. The actual logic to find or create a chat 
        // will be handled in the FloatingChat component by listening to selectedChatId
        // or we can put it here if we want to be more proactive.
        setIsOpen(true);
        setSelectedChatId(receiverId); // We use receiverId as a temporary "chat identifier"
    };

    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen, selectedChatId, setSelectedChatId, openChatWith }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
