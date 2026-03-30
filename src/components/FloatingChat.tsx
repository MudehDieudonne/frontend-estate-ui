import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Send, X, ChevronUp, Loader2, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "../context/ChatContext";

interface Message {
    id: string;
    text: string;
    userId: string;
    chatId: string;
    createdAt: string;
}

interface Chat {
    id: string;
    receiver: {
        id: string;
        username: string;
        avatar: string;
    };
    lastMessage: string;
    seenBy: string[];
}

export const FloatingChat = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const { isOpen, setIsOpen, selectedChatId, setSelectedChatId } = useChat();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const unreadCount = chats.filter((chat) => !chat.seenBy.includes(user?.id || "")).length;

    // Fetch chats when opened or when selectedChatId changes
    const fetchChats = useCallback(async () => {
        if (!user) return;
        setLoadingChats(true);
        try {
            const response = await api.get("/chats");
            setChats(response.data);

            // If we have a selectedChatId from context, try to find it in the chat list
            if (selectedChatId) {
                const existingChat = response.data.find((c: Chat) => c.receiver.id === selectedChatId);
                if (existingChat) {
                    setSelectedChat(existingChat);
                } else {
                    // Create new chat if it doesn't exist
                    const newChatRes = await api.post("/chats", { receiverId: selectedChatId });
                    // Refresh chat list to include the new chat
                    const refreshRes = await api.get("/chats");
                    setChats(refreshRes.data);
                    const createdChat = refreshRes.data.find((c: Chat) => c.id === newChatRes.data.id);
                    if (createdChat) setSelectedChat(createdChat);
                }
                // Clear the context selectedChatId so we don't keep trying to create it
                setSelectedChatId(null);
            }
        } catch (err) {
            console.error("Failed to fetch chats:", err);
        } finally {
            setLoadingChats(false);
        }
    }, [user, selectedChatId, setSelectedChatId]);

    useEffect(() => {
        if (isOpen && user) {
            fetchChats();
        }
    }, [isOpen, user, fetchChats]);

    // Fetch messages when chat selected
    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                setLoadingMessages(true);
                try {
                    const response = await api.get(`/messages/${selectedChat.id}`);
                    setMessages(response.data);
                    await api.put(`/chats/${selectedChat.id}`);
                    setChats((prev) =>
                        prev.map((c) =>
                            c.id === selectedChat.id ? { ...c, seenBy: Array.from(new Set([...(c.seenBy || []), user?.id || ""])) } : c
                        )
                    );
                } catch (err) {
                    console.error("Failed to fetch messages:", err);
                } finally {
                    setLoadingMessages(false);
                }
            };
            fetchMessages();
        }
    }, [selectedChat]);

    // Socket listeners
    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (selectedChat && selectedChat.id === data.chatId) {
                setMessages((prev) => [...prev, data]);
            }
            setChats((prev) =>
                prev.map((c) =>
                    c.id === data.chatId
                        ? { ...c, lastMessage: data.text, seenBy: [data.userId] }
                        : c
                )
            );

            if (data.userId !== user?.id && (document.hidden || !isOpen) && "Notification" in window) {
                if (Notification.permission === "granted") {
                    new Notification("New message", { body: data.text });
                } else if (Notification.permission === "default") {
                    Notification.requestPermission().catch(() => undefined);
                }
            }
        };

        if (socket) {
            socket.on("getMessage", handleMessage);
        }

        return () => {
            socket?.off("getMessage", handleMessage);
        };
    }, [socket, selectedChat, user?.id, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedChat || !user) return;

        const text = inputText;
        setInputText("");

        try {
            const response = await api.post(`/messages/${selectedChat.id}`, { text });
            const newMessage = response.data;

            setMessages((prev) => [...prev, newMessage]);

            socket?.emit("sendMessage", {
                receiverId: selectedChat.receiver.id,
                data: newMessage,
            });

            setChats((prev) =>
                prev.map((c) =>
                    c.id === selectedChat.id ? { ...c, lastMessage: text, seenBy: [user.id] } : c
                )
            );
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    if (!user) return null;

    return (
        <div className={cn(
            "fixed bottom-0 right-4 z-[100] flex flex-col items-end gap-2 transition-all duration-300",
            isOpen && !isMinimized && "w-full sm:w-80 right-0 sm:right-4 h-full sm:h-auto"
        )}>
            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "bg-background border border-primary/20 rounded-t-xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden",
                    isOpen && !isMinimized && "w-full h-full sm:h-[450px] sm:w-80",
                    isMinimized && "w-80 h-12"
                )}>
                    {/* Header */}
                    <div
                        className="p-3 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        <div className="flex items-center gap-2">
                            {selectedChat ? (
                                <>
                                    <Avatar className="h-6 w-6 border border-primary-foreground/20">
                                        <AvatarImage src={selectedChat.receiver.avatar} />
                                        <AvatarFallback className="text-[10px] bg-primary-foreground text-primary">
                                            {(selectedChat.receiver.username || "U").substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-bold truncate max-w-[120px]">
                                        {selectedChat.receiver.username}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="text-sm font-bold">Messaging</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {selectedChat && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 hover:bg-white/20 p-0"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChat(null);
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-white/20 p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <div className="flex-1 flex flex-col min-h-0 bg-muted/5">
                            {selectedChat ? (
                                <>
                                    {/* Messages View */}
                                    <ScrollArea className="flex-1 p-3">
                                        <div className="space-y-3">
                                            {loadingMessages ? (
                                                <div className="flex justify-center p-4">
                                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                </div>
                                            ) : messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[85%] p-2 rounded-xl text-xs shadow-sm",
                                                            msg.userId === user?.id
                                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                                : "bg-background border border-primary/10 rounded-tl-none"
                                                        )}
                                                    >
                                                        <p>{msg.text}</p>
                                                        <p className={cn(
                                                            "text-[8px] mt-1 text-right",
                                                            msg.userId === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"
                                                        )}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>
                                    <form onSubmit={handleSendMessage} className="p-2 bg-background border-t border-primary/10 flex gap-1">
                                        <Input
                                            placeholder="Type a message..."
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            className="h-8 text-xs flex-1 bg-muted/30"
                                        />
                                        <Button type="submit" size="icon" className="h-8 w-8 rounded-full" disabled={!inputText.trim()}>
                                            <Send className="h-3 w-3" />
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    {/* Chat List View */}
                                    <ScrollArea className="flex-1">
                                        {loadingChats ? (
                                            <div className="p-10 flex justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            </div>
                                        ) : chats.length > 0 ? (
                                            chats.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    onClick={() => setSelectedChat(chat)}
                                                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors border-b border-primary/5 last:border-0"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={chat.receiver.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {(chat.receiver.username || "U").substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="font-bold text-xs truncate">{chat.receiver.username}</p>
                                                        <p className={cn(
                                                            "text-[10px] truncate",
                                                            chat.seenBy.includes(user?.id || "") ? "text-muted-foreground" : "font-black text-foreground"
                                                        )}>
                                                            {chat.lastMessage || "Start chatting..."}
                                                        </p>
                                                    </div>
                                                    {!chat.seenBy.includes(user?.id || "") && (
                                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center text-muted-foreground text-[10px]">
                                                No conversations found.
                                            </div>
                                        )}
                                    </ScrollArea>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Launcher Button */}
            {!isOpen && (
                <>
                    {/* Desktop Launcher */}
                    <Button
                        className="hidden sm:flex rounded-t-xl rounded-b-none h-12 w-64 shadow-2xl items-center justify-between px-4 bg-primary text-primary-foreground hover:bg-primary/95"
                        onClick={() => {
                            setIsOpen(true);
                            setIsMinimized(false);
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <span className="font-bold">Messaging</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <span className="h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] leading-5 font-bold text-white">
                                    {unreadCount}
                                </span>
                            )}
                            <ChevronUp className="h-4 w-4" />
                        </div>
                    </Button>

                    {/* Mobile Circular Icon */}
                    <Button
                        className="sm:hidden relative rounded-full h-14 w-14 shadow-2xl flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/95 mb-4 mr-2"
                        onClick={() => {
                            setIsOpen(true);
                            setIsMinimized(false);
                        }}
                    >
                        <MessageSquare className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] leading-5 font-bold text-white">
                                {unreadCount}
                            </span>
                        )}
                    </Button>
                </>
            )}
        </div>
    );
};
