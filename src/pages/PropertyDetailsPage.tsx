import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { FeedLayout } from "../components/FeedLayout";
import { useChat } from "../context/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Heart, MessageCircle, Share2, MapPin, Bed, Expand, ArrowLeft, Ruler, Utensils, PawPrint, GraduationCap, Bus, UtensilsCrossed, Wallet, Loader2, Calendar, Sofa } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-expect-error - Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

export interface PostDetailData {
    desc: string;
    utilities?: string;
    pet?: string;
    income?: string;
    furnished?: string;
    size?: number;
    parkingLots?: number;
    hasSwimmingPool?: boolean;
    hasGym?: boolean;
    hasSecurity?: boolean;
    school?: number;
    bus?: number;
    restaurant?: number;
    hospital?: number;
    market?: number;
    parlor?: number;
}

export interface DetailedPropertyPost {
    id: string;
    title: string;
    price: number;
    images: string[];
    address: string;
    city: string;
    bedroom: number;
    bathroom: number;
    latitude: number;
    longitude: number;
    type: "rent" | "sale";
    property: string;
    createdAt: string;
    user: {
        username: string;
        avatar?: string;
    };
    postDetail?: PostDetailData;
    userId: string;
    isSaved: boolean;
}

export const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openChatWith } = useChat();
    const [post, setPost] = useState<DetailedPropertyPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    const fetchPost = useCallback(async () => {
        try {
            const response = await api.get(`/posts/${id}`);
            setPost(response.data);
        } catch (err: any) {
            console.error("Failed to fetch post details:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPost();
    }, [id, fetchPost]);

    const handleSave = async () => {
        if (!post) return;
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            await api.post("/users/save", { postId: post.id });
            setPost({ ...post, isSaved: !post.isSaved });
        } catch (err) {
            console.error("Failed to save post:", err);
        }
    };

    const handleSendMessage = async () => {
        if (!post || !user) {
            navigate("/login");
            return;
        }
        openChatWith(post.userId);
    };

    const handleShare = async () => {
        if (!post) return;
        const url = `${window.location.origin}/property/${post.id}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    text: post.postDetail?.desc || post.title,
                    url,
                });
                return;
            }
            await navigator.clipboard.writeText(url);
            alert("Property link copied to clipboard.");
        } catch (err) {
            console.error("Failed to share property:", err);
        }
    };

    if (loading) {
        return (
            <FeedLayout>
                <div className="p-20 text-center flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="animate-pulse">Loading property details...</p>
                </div>
            </FeedLayout>
        );
    }

    if (!post) {
        return (
            <FeedLayout>
                <div className="p-20 text-center space-y-4">
                    <p className="text-xl font-semibold">Property not found.</p>
                    <Button asChild>
                        <Link to="/feed">Back to feed</Link>
                    </Button>
                </div>
            </FeedLayout>
        );
    }

    return (
        <FeedLayout>
            <div className="max-w-5xl mx-auto space-y-6 pb-20">
                <Button variant="ghost" asChild className="mb-2">
                    <Link to="/feed" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Feed
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images and Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden border-primary/20 shadow-lg bg-background">
                            {/* main image */}
                            <div className="relative h-[450px] bg-muted">
                                <img
                                    src={post.images[activeImage] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000"}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-all duration-500"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className={`rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background ${post.isSaved ? "text-primary" : ""}`}
                                        onClick={handleSave}
                                    >
                                        <Heart className={`h-5 w-5 ${post.isSaved ? "fill-primary" : ""}`} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* thumbnail gallery */}
                            {post.images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto bg-muted/20 border-t border-primary/10 scrollbar-hide">
                                    {post.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`relative h-20 w-32 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? "border-primary opacity-100 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
                                        >
                                            <img src={img} alt={`${post.title} ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant={post.type === "sale" ? "default" : "secondary"} className="uppercase px-3 py-1 font-bold">For {post.type}</Badge>
                                        <Badge variant="outline" className="uppercase px-3 py-1 font-bold bg-primary/5">{post.property}</Badge>
                                    </div>
                                    <div className="flex justify-between items-end gap-4">
                                        <div className="space-y-1">
                                            <h1 className="text-2xl sm:text-4xl font-black text-primary tracking-tight leading-tight">{post.title}</h1>
                                            <p className="text-muted-foreground flex items-center text-lg">
                                                <MapPin className="h-5 w-5 mr-1 text-primary" /> {post.address}, {post.city}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="text-2xl sm:text-4xl font-black text-primary">{post.price.toLocaleString()} FCFA {post.type === 'rent' ? '/mo' : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-8 border-y border-primary/10">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Bed className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Bedrooms</span>
                                        <span className="text-sm font-bold">{post.bedroom}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Expand className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Bathrooms</span>
                                        <span className="text-sm font-bold">{post.bathroom}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Sofa className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Parlors</span>
                                        <span className="text-sm font-bold">{post.postDetail?.parlor ?? "Contact agent"}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Ruler className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Size</span>
                                        <span className="text-sm font-bold">{post.postDetail?.size ? `${post.postDetail.size} sqft` : "N/A"}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Listed</span>
                                        <span className="text-sm font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
                                    <Badge variant="outline">Parking: {post.postDetail?.parkingLots ?? "Contact agent"}</Badge>
                                    <Badge variant="outline">Pool: {post.postDetail?.hasSwimmingPool ? "Yes" : "No / Contact agent"}</Badge>
                                    <Badge variant="outline">Gym: {post.postDetail?.hasGym ? "Yes" : "No / Contact agent"}</Badge>
                                    <Badge variant="outline">Security: {post.postDetail?.hasSecurity ? "Yes" : "No / Contact agent"}</Badge>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black flex items-center gap-2">
                                        Description
                                    </h2>
                                    <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">{post.postDetail?.desc || "No description provided."}</p>
                                </div>

                                {/* Map Section */}
                                <div className="space-y-4 pt-6">
                                    <h2 className="text-2xl font-black flex items-center gap-2">
                                        <MapPin className="h-6 w-6 text-primary" /> Location
                                    </h2>
                                    <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-primary/10 shadow-inner">
                                        <MapContainer center={[post.latitude, post.longitude]} zoom={15} className="h-full w-full">
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={[post.latitude, post.longitude]} />
                                        </MapContainer>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Listing Agent & Quick Details */}
                    <div className="space-y-6">
                        {/* Agent Card */}
                        <Card className="border-primary/20 shadow-lg bg-background">
                            <CardContent className="p-6 text-center">
                                <Avatar className="h-20 w-20 mx-auto border-4 border-primary/20 shadow-md">
                                    <AvatarImage src={post.user.avatar} />
                                    <AvatarFallback className="text-2xl">{(post.user.username || "U").substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <h3 className="mt-4 text-xl font-bold">{post.user.username}</h3>
                                <p className="text-sm text-muted-foreground mb-6">Verified Listing Agent</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button onClick={handleSendMessage} className="w-full gap-2 font-bold py-6">
                                        <MessageCircle className="h-5 w-5" /> Send Message
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full font-bold border-primary text-primary hover:bg-primary/5 py-6"
                                        onClick={() => alert("Tour request sent to the agent! They will contact you shortly.")}
                                    >
                                        Request Tour
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Property Specs */}
                        <Card className="border-primary/20 shadow-lg bg-background">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-lg font-black border-b pb-2 border-primary/10 uppercase tracking-widest">General Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                            <Utensils className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Utilities</p>
                                            <p className="text-sm font-bold">
                                                {post.postDetail?.utilities === "owner"
                                                    ? "Owner is responsible"
                                                    : post.postDetail?.utilities === "tenant"
                                                        ? "Tenant is responsible"
                                                        : "Contact agent"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                            <PawPrint className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Pet Policy</p>
                                            <p className="text-sm font-bold">
                                                {post.postDetail?.pet === "allowed"
                                                    ? "Pets Allowed"
                                                    : post.postDetail?.pet === "not-allowed"
                                                        ? "Pets Not Allowed"
                                                        : "Contact agent"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                            <Wallet className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Income Requirement</p>
                                            <p className="text-sm font-bold tracking-tight">{post.postDetail?.income || "Contact agent"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center text-primary">
                                            <Sofa className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Furnished</p>
                                            <p className="text-sm font-bold tracking-tight">
                                                {post.postDetail?.furnished === "fully"
                                                    ? "Fully Furnished"
                                                    : post.postDetail?.furnished === "semi"
                                                        ? "Semi Furnished"
                                                        : post.postDetail?.furnished === "no"
                                                            ? "Not Furnished"
                                                            : "Contact agent"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Details */}
                        <Card className="border-primary/20 shadow-lg bg-background">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-lg font-black border-b pb-2 border-primary/10 uppercase tracking-widest">Nearby Services</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-bold">School</span>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">{post.postDetail?.school ? `${post.postDetail.school}m away` : "Contact agent"}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-bold">Bus Stop</span>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">{post.postDetail?.bus ? `${post.postDetail.bus}m away` : "Contact agent"}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UtensilsCrossed className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-bold">Restaurant</span>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">{post.postDetail?.restaurant ? `${post.postDetail.restaurant}m away` : "Contact agent"}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-bold">Hospital</span>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">{post.postDetail?.hospital ? `${post.postDetail.hospital}m away` : "Contact agent"}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Bus className="h-5 w-5 text-primary" />
                                            <span className="text-sm font-bold">Market</span>
                                        </div>
                                        <Badge variant="secondary" className="font-bold">{post.postDetail?.market ? `${post.postDetail.market}m away` : "Contact agent"}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FeedLayout>
    );
};

