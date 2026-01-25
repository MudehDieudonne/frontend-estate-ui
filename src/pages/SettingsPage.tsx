import { FeedLayout } from "@/components/FeedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt } from "react-icons/fa";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
export const SettingsPage = () => {
    const { user, updateUser, logout } = useAuth();
    const [name, setName] = useState(user?.username || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleUpdate = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await api.put(`/users/${user?.id}`, { username: name });
            if (updateUser && user) {
                updateUser({ ...user, username: name });
            }
            setSuccess("Profile updated successfully!");
        } catch (err: any) {
            console.error("Update failed:", err);
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

        try {
            await api.delete(`/users/${user?.id}`);
            logout();
            navigate("/");
        } catch (err: any) {
            console.error("Delete failed:", err);
            alert(err.response?.data?.message || "Failed to delete account");
        }
    };

    return (
        <FeedLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <nav className="flex flex-col space-y-1">
                            <Button variant="ghost" className="justify-start gap-2 bg-primary/10 text-primary">
                                <FaUser className="h-4 w-4" /> Account
                            </Button>
                            <Button variant="ghost" className="justify-start gap-2">
                                <FaLock className="h-4 w-4" /> Password
                            </Button>
                            <Button variant="ghost" className="justify-start gap-2">
                                <FaBell className="h-4 w-4" /> Notifications
                            </Button>
                            <Button variant="ghost" className="justify-start gap-2">
                                <FaShieldAlt className="h-4 w-4" /> Privacy
                            </Button>
                        </nav>
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your public profile details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">{error}</div>}
                                {success && <div className="p-3 bg-green-500/10 text-green-600 text-sm rounded-md border border-green-500/20">{success}</div>}

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed for security reasons.
                                    </p>
                                </div>
                                <Button className="mt-4" onClick={handleUpdate} disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/20">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                <CardDescription>
                                    Permanently delete your account and all associated data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="destructive" onClick={handleDelete}>Delete Account</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FeedLayout>
    );
};
