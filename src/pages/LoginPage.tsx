import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

const providerLabels: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

const socialErrorText: Record<string, string> = {
  invalid_state: "Social login session expired. Please try again.",
  missing_credentials: "Social login is not configured yet.",
  token_exchange_failed: "Could not verify social login token.",
  no_access_token: "No access token received from social provider.",
  userinfo_failed: "Could not load profile from social provider.",
  no_email: "Your social account has no public email.",
  unexpected_error: "Social login failed unexpectedly.",
};

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = (location.state as { message?: string } | null)?.message;
  const socialError = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("socialError") || "";
    return socialErrorText[code] || "";
  }, [location.search]);

  const getSocialStartUrl = (provider: "google" | "facebook" | "linkedin") => {
    const baseUrl = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    return `${baseUrl}/auth/oauth/${provider}/start`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username: identifier, password });
      login(response.data);
      navigate("/feed");
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.needsVerification && data?.email) {
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }

      const errorMessage = data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Login to IRED</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials or continue with social login.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
                {successMessage}
              </div>
            )}
            {socialError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {socialError}
              </div>
            )}
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="identifier">
                Username or Email
              </label>
              <Input
                id="identifier"
                placeholder="johndoe or john@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              {(["google", "facebook", "linkedin"] as const).map((provider) => (
                <a key={provider} href={getSocialStartUrl(provider)} className="block">
                  <Button type="button" variant="outline" className="w-full">
                    Continue with {providerLabels[provider]}
                  </Button>
                </a>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
