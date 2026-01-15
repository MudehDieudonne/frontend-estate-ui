import { FeedLayout } from "../components/FeedLayout";
import { Card, CardContent } from "../components/ui/card";
import { MessageSquare } from "lucide-react";

export const ChatPage = () => {
    return (
        <FeedLayout>
            <Card className="h-[600px] border-primary/20 shadow-lg flex flex-col">
                <CardContent className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="p-6 bg-primary/10 rounded-full">
                        <MessageSquare className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Messenger</h1>
                    <p className="text-muted-foreground text-center max-w-xs">
                        Connect with agents and buyers in real-time. Select a conversation to start chatting.
                    </p>
                </CardContent>
            </Card>
        </FeedLayout>
    );
};
