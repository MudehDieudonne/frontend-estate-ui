import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Button } from "../components/ui/button";

import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../lib/firebase";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    confirmationResult: ConfirmationResult;
  }
}


export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const initializeRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create user in our backend
      const response = await api.post("/auth/register", { username, email, phone, password });

      // 2. Trigger Firebase Phone Auth
      // Only trigger if phone is present and valid
      if (phone) {
        initializeRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
          const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
          // Store the confirmation object globally so the verification page can access it
          window.confirmationResult = confirmationResult;
        } catch (firebaseErr) {
          console.error("Firebase SMS error:", firebaseErr);
          throw new Error("Failed to send SMS via Firebase. Please verify your phone number format.");
        }
      }

      navigate("/verify-email", {
        state: {
          email: response.data?.user?.email || email,
          phone: response.data?.user?.phone || phone,
          isFirebaseVerification: !!phone, // tell verification page to use firebase
        },
      });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = errorObj.response?.data?.message || errorObj.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Join IRED</CardTitle>
          <CardDescription className="text-center">
            Create an account with email OTP verification.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
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
              <label className="text-sm font-medium leading-none" htmlFor="phone">
                Phone Number
              </label>
              <PhoneInput
                id="phone"
                international
                defaultCountry="CM"
                value={phone}
                onChange={(val) => setPhone(val ? val.toString() : "")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                style={{
                  "--PhoneInput-color--focus": "transparent",
                  "--PhoneInputCountrySelectArrow-color": "currentColor",
                  "--PhoneInputCountrySelectArrow-color--focus": "currentColor"
                } as React.CSSProperties}
              />
              <style>{`.PhoneInputInput { background: transparent; border: none; outline: none; padding-left: 0.5rem; width: 100%; color: inherit; }`}</style>
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_URL}/auth/oauth/google/start`;
              }}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline underline-offset-4">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
        <div id="recaptcha-container"></div>
      </Card>
    </div>
  );
};
