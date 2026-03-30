import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { FeedLayout } from "../components/FeedLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
    Users,
    Home,
    Clock,
    CheckCircle,
    ArrowRight,
    Search,
    Loader2,
    LayoutDashboard,
    UserCheck,
    TrendingUp
} from "lucide-react";

export const AdminDashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        if (!user || (user.role !== "ADMIN" && user.role !== "SUPREME_ADMIN")) {
            navigate("/feed");
            return;
        }

        const fetchData = async () => {
            try {
                const [statsRes, requestsRes] = await Promise.all([
                    api.get("/admin/stats"),
                    api.get("/admin/requests")
                ]);
                setStats(statsRes.data || { stats: { userCount: 0, postCount: 0, pendingRequestCount: 0 }, recentPosts: [] });
                setRequests(Array.isArray(requestsRes.data) ? requestsRes.data : []);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleApprove = async (requestId: string) => {
        setActionLoading(requestId);
        try {
            await api.post(`/admin/approve/${requestId}`);
            setRequests(prev => prev.filter(req => req.id !== requestId));
            // Refresh stats
            const statsRes = await api.get("/admin/stats");
            setStats(statsRes.data);
        } catch (err) {
            console.error("Failed to approve user", err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <FeedLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </FeedLayout>
        );
    }

    return (
        <FeedLayout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                            <LayoutDashboard className="h-8 w-8" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground">Welcome back, {user?.username}. Here's what's happening on IRED.</p>
                    </div>
                    {user?.role === "SUPREME_ADMIN" && (
                        <Badge variant="outline" className="text-amber-500 border-amber-500 px-3 py-1">
                            Supreme Access
                        </Badge>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    <Card className="border-primary/10 shadow-sm bg-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.stats?.userCount || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
                        </CardContent>
                    </Card>
                    <Card className="border-primary/10 shadow-sm bg-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                            <Home className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.stats?.postCount || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Active properties</p>
                        </CardContent>
                    </Card>
                    <Card className="border-amber-500/20 shadow-sm bg-amber-500/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600">{stats?.stats?.pendingRequestCount || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Users waiting for posting access</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="approvals" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="approvals" className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4" />
                            Approval Requests
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Recent Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="approvals">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Request Queue</CardTitle>
                                <CardDescription>Review and approve users who want to post properties.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {requests.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>No pending approval requests at the moment.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {requests.map((req) => (
                                            <div key={req.id} className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors">
                                                <div className="flex gap-4">
                                                    <Avatar>
                                                        <AvatarImage src={req.user.avatar || ""} />
                                                        <AvatarFallback>{(req.user.username || "U").substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold">{req.user.username}</p>
                                                        <p className="text-sm text-muted-foreground">{req.user.email}</p>
                                                        <p className="text-sm mt-2 italic bg-muted p-2 rounded">"{req.message || "No message provided."}"</p>
                                                        <p className="text-[10px] text-muted-foreground mt-1">Requested on {new Date(req.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {actionLoading === req.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                                    Approve
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="activity">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Property Listings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats?.recentPosts?.map((post: any) => (
                                            <div key={post.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center text-primary">
                                                        <Home className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                                                        <p className="text-xs text-muted-foreground">by @{post.user.username}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => navigate(`/property/${post.id}`)}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!stats?.recentPosts || stats.recentPosts.length === 0) && (
                                            <p className="text-sm text-center text-muted-foreground py-4">No recent listings found.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Supreme Actions</CardTitle>
                                    <CardDescription>Advanced management tools</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2" disabled>
                                        <Search className="h-4 w-4" /> Global User Search
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2" disabled>
                                        <Badge variant="secondary" className="mr-1">Coming Soon</Badge> Site Maintenance Mode
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4 italic">
                                        More administrative tools will be added here soon.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </FeedLayout>
    );
};
