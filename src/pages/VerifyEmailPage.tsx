import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const emailFromState = (location.state as { email?: string } | null)?.email;
  const [email, setEmail] = useState(emailFromState || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const canSubmit = useMemo(() => email.trim() && code.trim().length >= 4, [email, code]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/verify-email-otp", {
        email: email.trim(),
        code: code.trim(),
      });

      if (response.data?.user) {
        login(response.data.user);
      }

      navigate("/feed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "OTP verification failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setResending(true);

    try {
      await api.post("/auth/resend-email-otp", { email: email.trim() });
      setMessage("A new OTP has been sent to your email.");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP.";
      setError(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Verify Your Email</CardTitle>
          <CardDescription className="text-center">Enter the OTP sent to your email to activate your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleVerify}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">{error}</div>
            )}
            {message && (
              <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">{message}</div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="otp">OTP Code</label>
              <Input
                id="otp"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={!canSubmit || loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled={!email || resending} onClick={handleResend}>
              {resending ? "Resending..." : "Resend OTP"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Back to {" "}
              <Link to="/login" className="text-primary hover:underline underline-offset-4">Login</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
