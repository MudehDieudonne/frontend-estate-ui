import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../lib/api";
import { FeedLayout } from "../components/FeedLayout";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { X, Loader2 } from "lucide-react";

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

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e: L.LeafletMouseEvent) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export const CreateListingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [bedroom, setBedroom] = useState("1");
    const [bathroom, setBathroom] = useState("1");
    const [type, setType] = useState<"rent" | "sale">("sale");
    const [property, setProperty] = useState("apartment");
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(3.848, 11.5021)); // Default to Yaoundé

    const addImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            setImages([...images, imageUrl]);
            setImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (images.length < 3) {
            setError("Please add at least 3 property images.");
            return;
        }

        if (!position) {
            setError("Please pinpoint the location on the map.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title,
                description,
                price: Number(price),
                city,
                address,
                bedroom: Number(bedroom),
                bathroom: Number(bathroom),
                type,
                property,
                images,
                latitude: position.lat,
                longitude: position.lng,
            };

            await api.post("/api/posts", payload);
            navigate("/feed");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create listing. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FeedLayout>
            <div className="max-w-4xl mx-auto pb-10">
                <h1 className="text-3xl font-bold mb-6 text-primary">Post New Property</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Info */}
                    <Card className="border-primary/20">
                        <CardHeader>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                🏠 Basic Information
                            </h2>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Listing Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Luxury 3BR Apartment in Bastos"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="250000"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="Yaoundé"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Exact Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Street name, landmark..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Listing Type</Label>
                                    <Select value={type} onValueChange={(v: "rent" | "sale") => setType(v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sale/Rent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sale">For Sale</SelectItem>
                                            <SelectItem value="rent">For Rent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Property Type</Label>
                                    <Select value={property} onValueChange={setProperty}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="condo">Condo</SelectItem>
                                            <SelectItem value="land">Land</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bedroom">Bedrooms</Label>
                                    <Input
                                        id="bedroom"
                                        type="number"
                                        value={bedroom}
                                        onChange={(e) => setBedroom(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bathroom">Bathrooms</Label>
                                    <Input
                                        id="bathroom"
                                        type="number"
                                        value={bathroom}
                                        onChange={(e) => setBathroom(e.target.value)}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your property in detail..."
                                    className="h-32"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Images */}
                        <Card className="border-primary/20">
                            <CardHeader>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    📸 Property Images (Min 3)
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter image URL..."
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <Button type="button" onClick={addImage} size="icon" variant="secondary">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative group aspect-square">
                                                <img src={img} alt="preview" className="w-full h-full object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {images.length < 3 && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> {3 - images.length} more images required.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Map Geolocation */}
                        <Card className="border-primary/20 overflow-hidden">
                            <CardHeader className="bg-muted p-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    📍 Pinpoint Location
                                </h2>
                                <p className="text-xs text-muted-foreground">Click on the map to set the exact property coordinates.</p>
                            </CardHeader>
                            <div className="h-[250px] relative">
                                <MapContainer center={[3.848, 11.5021]} zoom={13} className="h-full w-full">
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <LocationMarker position={position} setPosition={setPosition} />
                                </MapContainer>
                                {position && (
                                    <div className="absolute bottom-2 left-2 z-[1000] bg-background/80 backdrop-blur-sm p-2 rounded text-[10px] shadow-sm border">
                                        Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-bold shadow-lg"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Post Property Listing"}
                        </Button>
                    </div>
                </form>
            </div>
        </FeedLayout>
    );
};

// Helper components for icons used in the form
const Plus = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);
