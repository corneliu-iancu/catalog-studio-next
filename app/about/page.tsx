import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Sparkles, Shield, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const t = await getTranslations('about');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const values = [
    {
      icon: Zap,
      title: t('values.items.simplicity.title'),
      description: t('values.items.simplicity.description'),
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: t('values.items.speed.title'),
      description: t('values.items.speed.description'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: t('values.items.beauty.title'),
      description: t('values.items.beauty.description'),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: t('values.items.reliability.title'),
      description: t('values.items.reliability.description'),
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const techStack = [
    {
      name: t('tech.stack.nextjs.name'),
      description: t('tech.stack.nextjs.description'),
      color: "bg-black text-white dark:bg-white dark:text-black"
    },
    {
      name: t('tech.stack.supabase.name'),
      description: t('tech.stack.supabase.description'),
      color: "bg-green-600 text-white"
    },
    {
      name: t('tech.stack.vercel.name'),
      description: t('tech.stack.vercel.description'),
      color: "bg-black text-white dark:bg-white dark:text-black"
    },
    {
      name: t('tech.stack.typescript.name'),
      description: t('tech.stack.typescript.description'),
      color: "bg-blue-600 text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1">
        {/* Hero Section - Stripe-inspired */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/5 to-chart-4/10" />
          <div className="container relative mx-auto px-4 py-32 md:py-40">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section - Enhanced spacing and cards */}
        <section className="py-32 border-b bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('mission.badge')}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {t('mission.title')}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {/* Problem Card */}
                <Card className="group relative hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative space-y-4 pb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950">
                      <span className="text-3xl">⚠️</span>
                    </div>
                    <CardTitle className="text-2xl">{t('mission.problem.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {t('mission.problem.description')}
                    </p>
                  </CardContent>
                </Card>

                {/* Solution Card - Highlighted */}
                <Card className="group relative border-primary shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-4/10" />
                  <CardHeader className="relative space-y-4 pb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-chart-1 to-chart-4 shadow-md">
                      <span className="text-3xl">✨</span>
                    </div>
                    <CardTitle className="text-2xl">{t('mission.solution.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {t('mission.solution.description')}
                    </p>
                  </CardContent>
                </Card>

                {/* Vision Card */}
                <Card className="group relative hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative space-y-4 pb-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <CardTitle className="text-2xl">{t('mission.vision.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {t('mission.vision.description')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section - Grid with better spacing */}
        <section className="py-32 bg-muted/30 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('values.badge')}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {t('values.title')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="group hover:shadow-md hover:scale-[1.01] transition-all duration-300">
                    <CardHeader className="space-y-4 pb-4">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${value.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                        <value.icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-base leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section - Cleaner layout */}
        <section className="py-32 border-b bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('tech.badge')}
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {t('tech.title')}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t('tech.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {techStack.map((tech, index) => (
                  <Card key={index} className="hover:shadow-md transition-all duration-300 group overflow-hidden">
                    <CardHeader className="space-y-3">
                      <Badge className={`${tech.color} w-fit text-sm px-4 py-1.5 font-semibold group-hover:scale-105 transition-transform`}>
                        {tech.name}
                      </Badge>
                      <CardDescription className="text-base text-foreground/80">
                        {tech.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Feature Pills - Stripe style */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                <div className="text-center space-y-3 p-6 rounded-2xl border hover:shadow-sm transition-all">
                  <div className="text-4xl">{t('tech.features.performance').split(' ')[0]}</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('tech.features.performance').split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <div className="text-center space-y-3 p-6 rounded-2xl border hover:shadow-sm transition-all">
                  <div className="text-4xl">{t('tech.features.security').split(' ')[0]}</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('tech.features.security').split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <div className="text-center space-y-3 p-6 rounded-2xl border hover:shadow-sm transition-all">
                  <div className="text-4xl">{t('tech.features.uptime').split(' ')[0]}</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('tech.features.uptime').split(' ').slice(1).join(' ')}
                  </p>
                </div>
                <div className="text-center space-y-3 p-6 rounded-2xl border hover:shadow-sm transition-all">
                  <div className="text-4xl">{t('tech.features.mobile').split(' ')[0]}</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('tech.features.mobile').split(' ').slice(1).join(' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Stripe-inspired with better hierarchy */}
        <section className="py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-4/10" />
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                {t('cta.badge')}
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="text-base px-8 py-6 h-auto group">
                  <Link href="/auth/signup">
                    {t('cta.startButton')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 h-auto">
                  <Link href="/contact">{t('cta.contactButton')}</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-medium pt-2">
                {t('cta.trial')}
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

