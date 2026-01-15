import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { FeedLayout } from "../components/FeedLayout";
import { PropertyPostProps } from "../components/PropertyPost";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Heart, MessageCircle, Share2, MapPin, Bed, Expand, ArrowLeft } from "lucide-react";

export const PropertyDetailsPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState<PropertyPostProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                console.error("Failed to fetch post details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="p-20 text-center animate-pulse">Loading property details...</div>;
    }

    if (!post) {
        return (
            <div className="p-20 text-center">
                <p>Property not found.</p>
                <Link to="/feed" className="text-primary hover:underline">Back to feed</Link>
            </div>
        );
    }

    return (
        <FeedLayout>
            <div className="space-y-6">
                <Button variant="ghost" asChild className="mb-2">
                    <Link to="/feed" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Feed
                    </Link>
                </Button>

                <Card className="overflow-hidden border-primary/20 shadow-lg">
                    <div className="relative h-[400px]">
                        <img
                            src={post.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000"}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <Button
                                variant="secondary"
                                size="icon"
                                className={`rounded-full bg-background/80 backdrop-blur-sm ${isSaved ? "text-primary" : ""}`}
                                onClick={() => setIsSaved(!isSaved)}
                            >
                                <Heart className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                            </Button>
                            <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <Badge variant={post.type === "sale" ? "default" : "secondary"}>For {post.type}</Badge>
                                <h1 className="text-3xl font-bold">{post.title}</h1>
                                <p className="text-muted-foreground flex items-center text-lg">
                                    <MapPin className="h-5 w-5 mr-1 text-primary" /> {post.city}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-primary">${post.price.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">ID: {post.id.substring(0, 8)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-primary/10">
                            <div className="text-center">
                                <Bed className="h-6 w-6 mx-auto mb-1 text-primary" />
                                <p className="text-sm font-semibold">{post.bedroom} Bedrooms</p>
                            </div>
                            <div className="text-center">
                                <Expand className="h-6 w-6 mx-auto mb-1 text-primary" />
                                <p className="text-sm font-semibold capitalize">{post.property}</p>
                            </div>
                            {/* Add more icons as needed */}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">About this property</h2>
                            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.description}</p>
                        </div>

                        <div className="p-6 bg-muted/50 rounded-xl border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={post.user.avatar} />
                                    <AvatarFallback>{post.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{post.user.username}</p>
                                    <p className="text-xs text-muted-foreground">Listing Agent</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="gap-2">
                                    <MessageCircle className="h-4 w-4" /> Message
                                </Button>
                                <Button variant="secondary">Call</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FeedLayout>
    );
};
