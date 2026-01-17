import { FeedLayout } from "@/components/FeedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaUser, FaLock, FaBell, FaShieldAlt } from "react-icons/fa";

export const SettingsPage = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.username || "");

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
                                <Button className="mt-4">Save Changes</Button>
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
                                <Button variant="destructive">Delete Account</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FeedLayout>
    );
};
