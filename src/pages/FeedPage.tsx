import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { FeedLayout } from "../components/FeedLayout";
import { PropertyPost, PropertyPostProps } from "../components/PropertyPost";
import { SearchBar } from "../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Home, Bookmark, History, PlusCircle, TrendingUp } from "lucide-react";

export const FeedPage = () => {
    const [posts, setPosts] = useState<PropertyPostProps[]>([]);
    const [searchParams, setSearchParams] = useState({
        city: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        bedroom: "",
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams(searchParams).toString();
                const response = await api.get(`/posts?${query}`);
                // Ensure the data is an array
                const data = Array.isArray(response.data) ? response.data :
                    (response.data && Array.isArray(response.data.posts) ? response.data.posts : []);
                setPosts(data);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [searchParams]);

    const handleSearch = (params: any) => {
        setSearchParams(params);
    };

    const LeftSidebar = (
        <Card className="border-primary/10 shadow-sm overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-primary/80 to-primary"></div>
            <CardHeader className="p-4 -mt-10 flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{(user?.username || "U").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="mt-2 font-bold text-lg">{user?.username}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 text-sm" asChild>
                    <Link to="/feed">
                        <Home className="h-4 w-4 text-primary" /> Feed
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-sm" asChild>
                    <Link to="/profile">
                        <Bookmark className="h-4 w-4 text-primary" /> Saved Properties
                    </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-sm" asChild>
                    <Link to="/profile">
                        <History className="h-4 w-4 text-primary" /> My Listings
                    </Link>
                </Button>
                <div className="pt-2">
                    <Button className="w-full gap-2" size="sm" asChild>
                        <Link to="/create-listing">
                            <PlusCircle className="h-4 w-4" /> Post Property
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const RightSidebar = (
        <div className="space-y-4">
            <Card className="border-primary/10 shadow-sm">
                <CardHeader className="p-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" /> Market Trends
                    </h3>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Prices in Yaoundé</p>
                        <p className="text-xs text-green-500">Up 5.2% this month</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Top Location</p>
                        <p className="text-xs text-muted-foreground">Bastos, Yaoundé</p>
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 text-[10px] text-muted-foreground text-center">
                Elite Estates © 2026. All rights reserved.
            </div>
        </div>
    );

    return (
        <FeedLayout leftSidebar={LeftSidebar} rightSidebar={RightSidebar}>
            <div className="mb-6">
                <SearchBar onSearch={handleSearch} />
            </div>
            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-[450px] animate-pulse bg-muted" />
                    ))}
                </div>
            ) : posts.length > 0 ? (
                posts.map((post) => (
                    <PropertyPost key={post.id} post={post} />
                ))
            ) : (
                <div className="text-center py-20 bg-background rounded-lg border border-dashed border-primary/20">
                    <p className="text-muted-foreground">No listings found. Be the first to post!</p>
                </div>
            )}
        </FeedLayout>
    );
};
