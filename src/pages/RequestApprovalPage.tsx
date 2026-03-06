import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { FeedLayout } from "../components/FeedLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const RequestApprovalPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<any>(null);

    const fromCreateListing = location.state?.from === "create-listing";

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get("/approval/status");
                setStatus(res.data);
                if (res.data.status === "APPROVED") {
                    // Redirect if already approved
                    if (fromCreateListing) navigate("/create-listing");
                }
            } catch (err) {
                console.error("Failed to fetch request status", err);
            }
        };
        fetchStatus();
    }, [navigate, fromCreateListing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/approval/submit", { message });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    if (user?.isApproved || user?.role !== "USER") {
        return (
            <FeedLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                    <h1 className="text-2xl font-bold">Your account is already approved</h1>
                    <p className="text-muted-foreground mt-2">You can go ahead and post properties.</p>
                    <Button className="mt-6" onClick={() => navigate("/create-listing")}>Go to Post Property</Button>
                </div>
            </FeedLayout>
        );
    }

    return (
        <FeedLayout>
            <div className="max-w-2xl mx-auto py-10 px-4">
                <Card className="border-primary/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary">Account Approval Request</CardTitle>
                        <CardDescription>
                            {fromCreateListing
                                ? "To post properties on Elite Estates, your account needs to be verified by our team."
                                : "Request permission to post properties and listings on the platform."}
                        </CardDescription>
                    </CardHeader>

                    {!submitted && (!status || status.status === "NONE" || status.status === "REJECTED") ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {status?.status === "REJECTED" && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        Your previous request was rejected. You can submit a new one.
                                    </div>
                                )}
                                {error && (
                                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="message">Tell us about yourself / your agency (Optional)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Briefly explain why you want to post properties..."
                                        className="h-32"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Our admins will review your profile and message to approve your account for property posting. This usually takes less than 24 hours.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Submit Request"}
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <CardContent className="py-10 text-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold">Request Submitted!</h2>
                            <p className="text-muted-foreground mt-2">
                                Your request is currently pending review. We'll notify you once it's approved.
                            </p>
                            <Button className="mt-8 variant-outline w-full" onClick={() => navigate("/feed")}>
                                Return to Feed
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        </FeedLayout>
    );
};
