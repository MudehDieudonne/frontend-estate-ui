import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Share2, MapPin, Bed, Expand, Bath, Car, Waves } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

interface PropertyPostDetail {
    size?: number;
    parkingLots?: number;
    hasSwimmingPool?: boolean;
}

export interface PropertyPostProps {
    id: string;
    title: string;
    description: string;
    price: number;
    city: string;
    type: "rent" | "sale";
    property: string;
    bedroom: number;
    bathroom?: number;
    images?: string[];
    isSaved?: boolean;
    postDetail?: PropertyPostDetail;
    user: {
        username: string;
        avatar?: string;
        id?: string;
    };
    createdAt: string;
}

export const PropertyPost = ({ post }: { post: PropertyPostProps }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));

    useEffect(() => {
        setIsSaved(Boolean(post.isSaved));
    }, [post.isSaved]);

    const handleProtectedAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        if (!user) {
            navigate("/register");
            return;
        }
        action();
    };

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            navigate("/register");
            return;
        }

        try {
            await api.post("/users/save", { postId: post.id });
            setIsSaved((prev) => !prev);
        } catch (err) {
            console.error("Failed to save post:", err);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = `${window.location.origin}/property/${post.id}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: post.description,
                    url,
                });
                return;
            }

            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to share listing:", err);
        }
    };

    return (
        <Card
            className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all shadow-sm cursor-pointer"
            onClick={() => navigate(`/property/${post.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/property/${post.id}`);
                }
            }}
        >
            <CardHeader className="p-4 flex flex-row items-center space-x-4">
                <Avatar>
                    <AvatarImage src={post.user?.avatar} />
                    <AvatarFallback>{(post.user?.username || "U").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">{post.user?.username || "Unknown Developer"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={post.type === "sale" ? "default" : "secondary"} className="capitalize">
                    For {post.type}
                </Badge>
            </CardHeader>

            <div className="relative group">
                <img
                    src={post.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000"}
                    alt={post.title}
                    className="w-full h-[300px] object-cover"
                />
                <div className="absolute top-2 right-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full bg-background/50 backdrop-blur-sm transition-colors ${isSaved ? "text-primary" : "text-white"}`}
                        onClick={handleToggleSave}
                    >
                        <Heart className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                    </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                    <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                        {post.price.toLocaleString()} FCFA {post.type === 'rent' ? '/mo' : ''}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4 space-y-3">
                <h3 className="text-xl font-bold hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-primary" /> {post.city}
                </p>
                <p className="text-sm line-clamp-2 text-foreground/80">{post.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium pt-2 text-muted-foreground">
                    <span className="flex items-center"><Bed className="h-4 w-4 mr-1" /> {post.bedroom} Beds</span>
                    <span className="flex items-center"><Bath className="h-4 w-4 mr-1" /> {post.bathroom ?? "N/A"} Baths</span>
                    <span className="flex items-center capitalize"><Expand className="h-4 w-4 mr-1" /> {post.property}</span>
                    <span className="flex items-center"><Car className="h-4 w-4 mr-1" /> {post.postDetail?.parkingLots ?? 0} Parking</span>
                    {post.postDetail?.hasSwimmingPool && (
                        <span className="flex items-center"><Waves className="h-4 w-4 mr-1" /> Pool</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-2 border-t flex items-center justify-between">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={(e) => handleProtectedAction(e, () => navigate(`/property/${post.id}`))}
                    >
                        <MessageCircle className="h-4 w-4" /> Inquire
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={handleShare}
                    >
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                </div>
                <Button
                    variant="link"
                    size="sm"
                    onClick={(e) => handleProtectedAction(e, () => navigate(`/property/${post.id}`))}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
};
