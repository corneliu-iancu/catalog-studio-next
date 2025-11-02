import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, QrCode, Palette, BarChart3, ChefHat, Coffee, Utensils, UserPlus, Upload, Share2, ArrowRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const t = await getTranslations('home');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const sampleRestaurants = [
    {
      slug: 'bella-luna',
      name: t('liveExamples.bellaLuna.name'),
      description: t('liveExamples.bellaLuna.description'),
      cuisine: t('liveExamples.italian')
    },
    {
      slug: 'pizzeria-la-badiu',
      name: t('liveExamples.pizzeriaBadiu.name'),
      description: t('liveExamples.pizzeriaBadiu.description'),
      cuisine: t('liveExamples.italian')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header currentLocale={currentLocale} />
      
      {/* Hero Section - Full screen with bold visuals */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-0" />

        <div className="container mx-auto px-4 z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signup">{t('hero.startFreeTrial')}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/tonys-pizza">{t('hero.seeLiveDemo')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid - 4 Key Features */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-1/10 text-chart-1 mb-2">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">{t('features.updateInSeconds.title')}</h3>
            <p className="text-muted-foreground">{t('features.updateInSeconds.description')}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-2/10 text-chart-2 mb-2">
              <QrCode className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">{t('features.contactlessModern.title')}</h3>
            <p className="text-muted-foreground">{t('features.contactlessModern.description')}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-4/10 text-chart-4 mb-2">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">{t('features.professionalDesign.title')}</h3>
            <p className="text-muted-foreground">{t('features.professionalDesign.description')}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-5/10 text-chart-5 mb-2">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">{t('features.knowWhatWorks.title')}</h3>
            <p className="text-muted-foreground">{t('features.knowWhatWorks.description')}</p>
          </div>
        </div>
      </div>

      {/* Product Showcase - Split Screen Demo */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{t('showcase.title')}</h2>
            <p className="text-xl text-muted-foreground">{t('showcase.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm px-4 py-2">{t('showcase.youManage')}</Badge>
              <div className="relative rounded-lg border bg-background p-4 shadow-2xl">
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    {t('showcase.dashboardScreenshot')}<br/><span className="text-sm">(/dashboard/menu)</span>
                  </p>
                </div>
                <div className="absolute -top-3 right-12 hidden lg:block">
                  <Badge className="shadow-lg">{t('showcase.dragAndDrop')}</Badge>
                </div>
                <div className="absolute top-1/3 -right-3 hidden lg:block">
                  <Badge className="shadow-lg">{t('showcase.quickEdit')}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm px-4 py-2">{t('showcase.theyExperience')}</Badge>
              <div className="relative max-w-sm mx-auto">
                <div className="relative rounded-[2.5rem] border-8 border-foreground bg-background shadow-2xl overflow-hidden">
                  <div className="aspect-[9/19] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4 text-sm">
                      {t('showcase.mobileMenuScreenshot')}<br/><span className="text-xs">(/tonys-pizza)</span>
                    </p>
                  </div>
                </div>
                <div className="absolute -left-6 top-12 hidden lg:block">
                  <Badge className="shadow-lg">{t('showcase.gorgeousDesign')}</Badge>
                </div>
                <div className="absolute -right-6 top-1/2 hidden lg:block">
                  <Badge className="shadow-lg">{t('showcase.easyBrowsing')}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{t('targetAudience.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('targetAudience.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <ChefHat className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{t('targetAudience.independent.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">{t('targetAudience.independent.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Coffee className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{t('targetAudience.cafes.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">{t('targetAudience.cafes.description')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Utensils className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">{t('targetAudience.fineDining.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">{t('targetAudience.fineDining.description')}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works - 3 Steps */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{t('howItWorks.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">01</div>
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">{t('howItWorks.step1.title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step1.description')}</p>
            </div>

            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">02</div>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">{t('howItWorks.step2.title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step2.description')}</p>
            </div>

            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">03</div>
              <Share2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">{t('howItWorks.step3.title')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Examples Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">{t('liveExamples.title')}</h2>
          <p className="text-xl text-muted-foreground">{t('liveExamples.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {sampleRestaurants.map((restaurant) => (
            <Link key={restaurant.slug} href={`/${restaurant.slug}`} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl group-hover:scale-[1.03]">
                <CardHeader className="space-y-4">
                  <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{restaurant.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                      <Badge variant="secondary">{restaurant.cuisine}</Badge>
                    </div>
                    <CardDescription className="text-base">{restaurant.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t('liveExamples.viewLiveMenu')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-4/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{t('finalCta.title')}</h2>
            <p className="text-xl text-muted-foreground">{t('finalCta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signup">{t('finalCta.startFreeTrial')}</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/contact">{t('finalCta.contactSales')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

