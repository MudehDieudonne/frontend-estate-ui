import { FeedLayout } from "../components/FeedLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <FeedLayout>
            <Card className="border-primary/20 shadow-lg">
                <CardHeader className="flex flex-col items-center p-10 bg-muted/30">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-2xl">{user?.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-3xl font-bold text-primary">{user?.username}</h1>
                    <p className="text-muted-foreground">{user?.email}</p>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="text-center py-20 text-muted-foreground border-t">
                        <p>Your property listings and saved items will appear here.</p>
                    </div>
                </CardContent>
            </Card>
        </FeedLayout>
    );
};
