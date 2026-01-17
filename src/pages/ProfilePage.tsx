import { FeedLayout } from "../components/FeedLayout";
import { useAuth } from "../context/AuthContext";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Settings, LogOut, Loader2, Link as LinkIcon, Upload, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { uploadImage } from "../lib/cloudinary";
import api from "../lib/api";
import { Link } from "react-router-dom";
import { FaHome, FaCamera } from "react-icons/fa";
import { PropertyPost, PropertyPostProps } from "../components/PropertyPost";

export const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [userPosts, setUserPosts] = useState<PropertyPostProps[]>([]);
    const [savedPosts, setSavedPosts] = useState<PropertyPostProps[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await api.get("/users/profilePosts");
                setUserPosts(res.data.userPosts);
                setSavedPosts(res.data.savedPosts);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoadingPosts(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const updateAvatar = async (url: string) => {
        try {
            await api.put("/users/" + user?.id, { avatar: url });
            if (updateUser) {
                updateUser({ ...user!, avatar: url });
            }
            setShowUrlInput(false);
        } catch (err) {
            console.error("Failed to update avatar", err);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadedUrl = await uploadImage(file);
            await updateAvatar(uploadedUrl);
        } catch (err) {
            console.error("Avatar upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (avatarUrl) {
            updateAvatar(avatarUrl);
        }
    };

    return (
        <FeedLayout>
            <div className="max-w-4xl mx-auto space-y-6 pb-10">
                <Card className="border-primary/20 shadow-lg overflow-hidden">
                    <CardHeader className="flex flex-col items-center p-10 bg-muted/30 relative">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="text-3xl">{user?.username?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                                <label className="flex-1 h-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border-r border-white/20" title="Upload Image">
                                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                </label>
                                <button
                                    className="flex-1 h-full flex items-center justify-center hover:bg-white/20 transition-colors"
                                    title="Enter URL"
                                    onClick={() => setShowUrlInput(!showUrlInput)}
                                >
                                    <LinkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {showUrlInput && (
                            <div className="mt-4 flex gap-2 w-full max-w-xs animate-in fade-in slide-in-from-top-2">
                                <Input
                                    placeholder="Paste avatar URL..."
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="h-8 text-xs"
                                />
                                <Button size="sm" className="h-8" onClick={handleUrlSubmit}>Add</Button>
                            </div>
                        )}
                        <h1 className="mt-4 text-3xl font-bold text-primary">{user?.username}</h1>
                        <p className="text-muted-foreground">{user?.email}</p>

                        <div className="mt-6 flex gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link to="/settings">
                                    <Settings className="h-4 w-4 mr-2" /> Settings
                                </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => logout()}>
                                <LogOut className="h-4 w-4 mr-2" /> Logout
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">My Listings</p>
                                        <p className="text-2xl font-bold">{userPosts.length}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <FaHome />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Saved Items</p>
                                        <p className="text-2xl font-bold">{savedPosts.length}</p>
                                    </div>
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <FaCamera />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h2 className="text-xl font-bold">My Property Listings</h2>
                                <Button asChild size="sm" className="gap-2">
                                    <Link to="/create-listing"><Plus className="h-4 w-4" /> New Post</Link>
                                </Button>
                            </div>

                            {loadingPosts ? (
                                <div className="py-20 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : userPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userPosts.map(post => (
                                        <PropertyPost key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <p>You haven't posted any properties yet.</p>
                                    <Button asChild variant="outline" className="mt-4">
                                        <Link to="/create-listing">Create your first listing</Link>
                                    </Button>
                                </div>
                            )}

                            {savedPosts.length > 0 && (
                                <div className="mt-12 space-y-6">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h2 className="text-xl font-bold">Saved Properties</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {savedPosts.map(post => (
                                            <PropertyPost key={post.id} post={post} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FeedLayout>
    );
};
