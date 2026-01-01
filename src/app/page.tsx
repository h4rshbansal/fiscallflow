"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Logo } from "@/components/logo";
import { ArrowRight, BarChart3, PiggyBank, Target } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const onboardingFeatures = [
  {
    icon: PiggyBank,
    title: "Track Your Spending",
    description: "Easily log every transaction to see where your money is going.",
  },
  {
    icon: BarChart3,
    title: "Visualize Your Habits",
    description: "Interactive charts and reports help you understand your financial patterns.",
  },
  {
    icon: Target,
    title: "Set & Achieve Goals",
    description: "Create savings goals and track your progress towards them.",
  },
];


export default function LandingPage() {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                 <div className="absolute top-8">
                    <Logo />
                </div>
                <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                        {onboardingFeatures.map((feature, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                            <Card>
                                <CardContent className="flex flex-col aspect-square items-center justify-center p-6 text-center">
                                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    <p className="text-muted-foreground mt-2">{feature.description}</p>
                                </CardContent>
                            </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <Button asChild className="mt-8 w-full max-w-xs">
                    <Link href="/auth">Get Started</Link>
                </Button>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
                <Logo />
                <h1 className="text-4xl font-bold tracking-tight">Master Your Money</h1>
                <p className="text-muted-foreground text-lg">FiscalFlow is a modern, intuitive, and AI-powered personal finance application designed to help you take control of your financial life.</p>
                <Button asChild size="lg" className="group">
                    <Link href="/auth">
                        Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
            <div className="space-y-6">
                {onboardingFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <feature.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    </div>
  );
}
