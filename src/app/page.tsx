"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Slider } from "@/components/ui/slider";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState([18]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!age || age[0] < 13) {
      setError("You must be at least 13 years old.");
      return;
    }
    setError("");
    localStorage.setItem("userName", name);
    localStorage.setItem("userAge", age[0].toString());
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
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
              />
            </div>
             <div className="space-y-2 pt-2">
              <Label htmlFor="age">Age: {age[0]}</Label>
              <Slider
                id="age"
                min={13}
                max={100}
                step={1}
                value={age}
                onValueChange={setAge}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleLogin} className="w-full">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
