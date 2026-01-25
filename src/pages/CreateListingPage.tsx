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
import { X, Loader2, Upload, Plus, Info } from "lucide-react";
import { FaHome, FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { uploadMultipleImages } from "../lib/cloudinary";

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
    const [parlor, setParlor] = useState("1");
    const [size, setSize] = useState("");
    const [school, setSchool] = useState("");
    const [bus, setBus] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [position, setPosition] = useState<L.LatLng | null>(new L.LatLng(3.848, 11.5021)); // Default to Yaoundé
    const [uploading, setUploading] = useState(false);
    const [inputMode, setInputMode] = useState<"upload" | "url">("upload");
    const [manualUrl, setManualUrl] = useState("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setError("");
        try {
            const uploadedUrls = await uploadMultipleImages(files);
            setImages(prev => [...prev, ...uploadedUrls]);
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to upload images. Please check your Cloudinary configuration.");
        } finally {
            setUploading(false);
        }
    };

    const addManualUrl = () => {
        if (!manualUrl) return;
        if (!images.includes(manualUrl)) {
            setImages(prev => [...prev, manualUrl]);
        }
        setManualUrl("");
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
                postDetail: {
                    size: Number(size),
                    parlor: Number(parlor),
                    school: Number(school),
                    bus: Number(bus),
                    restaurant: Number(restaurant),
                }
            };

            await api.post("/posts", payload);
            navigate("/feed");
        } catch (err: any) {
            console.error("Create Listing Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to create listing. Please try again.";
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
                                <FaHome className="text-primary" /> Basic Information
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
                                    <Label htmlFor="price">Price (FCFA)</Label>
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
                                    <Label htmlFor="parlor">Parlors</Label>
                                    <Input
                                        id="parlor"
                                        type="number"
                                        value={parlor}
                                        onChange={(e) => setParlor(e.target.value)}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                <div className="space-y-2">
                                    <Label htmlFor="size">Size (sqft/sqm)</Label>
                                    <Input
                                        id="size"
                                        type="number"
                                        value={size}
                                        onChange={(e) => setSize(e.target.value)}
                                        placeholder="e.g. 120"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="school">Nearby School (m)</Label>
                                    <Input
                                        id="school"
                                        type="number"
                                        value={school}
                                        onChange={(e) => setSchool(e.target.value)}
                                        placeholder="e.g. 500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bus">Nearby Bus (m)</Label>
                                    <Input
                                        id="bus"
                                        type="number"
                                        value={bus}
                                        onChange={(e) => setBus(e.target.value)}
                                        placeholder="e.g. 200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="restaurant">Restaurant (m)</Label>
                                    <Input
                                        id="restaurant"
                                        type="number"
                                        value={restaurant}
                                        onChange={(e) => setRestaurant(e.target.value)}
                                        placeholder="e.g. 300"
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
                                    <FaCamera className="text-primary" /> Property Images (Min 3)
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex bg-muted p-1 rounded-md mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setInputMode("upload")}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-all ${inputMode === "upload" ? "bg-background shadow-sm" : "hover:text-muted-foreground"}`}
                                        >
                                            Local Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInputMode("url")}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-all ${inputMode === "url" ? "bg-background shadow-sm" : "hover:text-muted-foreground"}`}
                                        >
                                            Image URL
                                        </button>
                                    </div>

                                    {inputMode === "upload" ? (
                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-6 hover:bg-primary/5 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={uploading}
                                            />
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                    <p className="text-sm">Uploading...</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                    <Upload className="h-8 w-8" />
                                                    <p className="text-sm font-medium">Click or drag images to upload</p>
                                                    <p className="text-xs">Support multiple images</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Paste image URL here..."
                                                value={manualUrl}
                                                onChange={(e) => setManualUrl(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addManualUrl())}
                                            />
                                            <Button type="button" onClick={addManualUrl} size="icon" variant="secondary">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
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
                                        <Info className="h-3 w-3 text-primary" /> {3 - images.length} more images required.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Map Geolocation */}
                        <Card className="border-primary/20 overflow-hidden">
                            <CardHeader className="bg-muted p-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" /> Pinpoint Location
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


