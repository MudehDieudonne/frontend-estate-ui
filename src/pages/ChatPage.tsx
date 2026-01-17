import { useEffect, useState, useRef } from "react";
import { FeedLayout } from "../components/FeedLayout";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import api from "../lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { MessageSquare, Send, Loader2 } from "lucide-react";

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

export const ChatPage = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await api.get("/chats");
                setChats(response.data);
            } catch (err) {
                console.error("Failed to fetch chats:", err);
            } finally {
                setLoadingChats(false);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                setLoadingMessages(true);
                try {
                    const response = await api.get(`/messages/${selectedChat.id}`);
                    setMessages(response.data);
                    // Mark chat as seen
                    await api.put(`/chats/${selectedChat.id}`);
                } catch (err) {
                    console.error("Failed to fetch messages:", err);
                } finally {
                    setLoadingMessages(false);
                }
            };
            fetchMessages();
        }
    }, [selectedChat]);

    useEffect(() => {
        const handleMessage = (data: Message) => {
            if (selectedChat && selectedChat.id === data.chatId) {
                setMessages((prev) => [...prev, data]);
            }
            // Always update the last message in the chat list
            setChats((prev) =>
                prev.map((c) =>
                    c.id === data.chatId
                        ? { ...c, lastMessage: data.text, seenBy: [data.userId] }
                        : c
                )
            );
        };

        if (socket) {
            socket.on("getMessage", handleMessage);
        }

        return () => {
            socket?.off("getMessage", handleMessage);
        };
    }, [socket, selectedChat]);

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

            // Emit socket event
            socket?.emit("sendMessage", {
                receiverId: selectedChat.receiver.id,
                data: newMessage,
            });

            // Update local chat list
            setChats((prev) =>
                prev.map((c) =>
                    c.id === selectedChat.id ? { ...c, lastMessage: text, seenBy: [user.id] } : c
                )
            );
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <FeedLayout>
            <div className="flex bg-background h-[calc(100vh-140px)] border-[1px] rounded-xl overflow-hidden shadow-xl border-primary/10">
                {/* Chat List Sidebar */}
                <div className="w-1/3 border-r-[1px] border-primary/10 flex flex-col">
                    <div className="p-4 border-b-[1px] border-primary/10 bg-muted/30">
                        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" /> Messenger
                        </h2>
                    </div>
                    <ScrollArea className="flex-1">
                        {loadingChats ? (
                            <div className="p-10 flex justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : chats.length > 0 ? (
                            chats.map((chat: Chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-primary/5 transition-colors border-b-[1px] border-primary/10 last:border-0 ${selectedChat?.id === chat.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarImage src={chat.receiver.avatar} />
                                        <AvatarFallback>{chat.receiver.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-sm">{chat.receiver.username}</p>
                                        </div>
                                        <p className={`text-xs truncate ${chat.seenBy.includes(user?.id || "") ? "text-muted-foreground" : "font-bold text-foreground"}`}>
                                            {chat.lastMessage || "Start a conversation..."}
                                        </p>
                                    </div>
                                    {!chat.seenBy.includes(user?.id || "") && (
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-muted-foreground text-sm">
                                No conversations yet.
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Message Thread */}
                <div className="flex-1 flex flex-col bg-muted/5">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b-[1px] border-primary/10 flex items-center gap-3 bg-background">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedChat.receiver.avatar} />
                                    <AvatarFallback>{selectedChat.receiver.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm">{selectedChat.receiver.username}</p>
                                    <p className="text-[10px] text-green-500">Active now</p>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {loadingMessages ? (
                                        <div className="flex justify-center p-10">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : messages.map((msg: Message) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${msg.userId === user?.id
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-background border border-primary/10 rounded-tl-none"
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 ${msg.userId === user?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 bg-background border-t-[1px] border-primary/10">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        className="flex-1 bg-muted/30 border-primary/10 focus-visible:ring-primary"
                                    />
                                    <Button type="submit" size="icon" disabled={!inputText.trim()} className="rounded-full shadow-lg">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <div className="p-6 bg-primary/5 rounded-full border border-primary/10">
                                <MessageSquare className="h-12 w-12 text-primary/40" />
                            </div>
                            <p>Select a contact to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </FeedLayout>
    );
};
