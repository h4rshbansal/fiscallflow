"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank } from "lucide-react";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { auth } = initializeFirebase();
    setAuth(auth);
  }, []);

  const handleLogin = async () => {
    if (!auth) {
      setError("Firebase is not initialized. Please try again in a moment.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    try {
      await signInAnonymously(auth);
      localStorage.setItem("userName", name);
      router.push("/dashboard");
    } catch (error) {
      console.error("Anonymous sign-in failed", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <PiggyBank className="h-8 w-8 text-accent" />
        <span className="font-headline text-2xl font-semibold text-foreground">Fiscal Flow</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Enter your name to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleLogin} className="w-full" disabled={!auth}>
              {auth ? 'Continue' : 'Initializing...'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
