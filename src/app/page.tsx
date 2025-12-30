import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, BarChart, CircleDollarSign, ListChecks } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: <ListChecks className="h-8 w-8 text-primary" />,
    title: 'Smart Transaction Logging',
    description: 'Quickly add and categorize transactions with our streamlined input form.',
  },
  {
    icon: <CircleDollarSign className="h-8 w-8 text-primary" />,
    title: 'Intelligent Budgeting',
    description: 'Set monthly budgets and get AI-powered recommendations to stay on track.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Visual Insights',
    description: 'Understand your spending with interactive charts and detailed reports.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && 
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                />
              }
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Master Your Money with <span className="text-accent">Fiscal Flow</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Effortless budgeting, smart savings, and clear financial insights. Take control of your financial future today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Fiscal Flow provides a complete suite of tools to help you manage your finances effectively and reach your goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center gap-4 text-center">
                  <div className="rounded-full bg-background p-4 shadow-md">{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Take Control of Your Finances?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start your journey to financial clarity with Fiscal Flow. It&apos;s free to get started.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/dashboard">
                  Sign Up for Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex h-14 w-full items-center justify-center border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Fiscal Flow. All rights reserved.</p>
      </footer>
    </div>
  );
}
