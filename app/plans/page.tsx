import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Sparkles } from "lucide-react";
import { PLANS, EARLY_BIRD_OFFER, ANNUAL_DISCOUNT_PERCENTAGE, CURRENCY_CONFIG } from "@/lib/config/plans";

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
  const t = await getTranslations('plans');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  // Get currency config for current locale
  const currencyConfig = CURRENCY_CONFIG[currentLocale as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.ro;
  const currencyCode = currencyConfig.code as 'EUR' | 'RON';

  // Helper function to format price with currency
  const formatPrice = (amount: number) => {
    if (amount === 0) {
      return currentLocale === 'en' ? 'Free' : 'Gratis';
    }
    return `${amount} ${currencyConfig.symbol}`;
  };

  // Map plan features to translation keys
  const getFeatureLabel = (featureName: string, planId: string) => {
    const featureMap: { [key: string]: string } = {
      "1 restaurant/menu": t('features.restaurants.one'),
      "Up to 3 restaurants/menus": t('features.restaurants.three'),
      "Unlimited restaurants/menus": t('features.restaurants.unlimited'),
      "Up to 20 products": t('features.products.twenty'),
      "Up to 100 products": t('features.products.hundred'),
      "Unlimited products": t('features.products.unlimited'),
      "2 menu templates": t('features.templates.basic'),
      "10 premium templates": t('features.templates.premium'),
      "All premium templates": t('features.templates.all'),
      "Basic image uploads (720p)": t('features.images.basic'),
      "High-quality image uploads (1080p)": t('features.images.hd'),
      "Ultra HD image uploads (4K)": t('features.images.uhd'),
      "QR code generation": t('features.qrCode'),
      "Mobile-responsive design": t('features.mobileResponsive'),
      "Basic analytics": t('features.basicAnalytics'),
      "Advanced analytics": t('features.advancedAnalytics'),
      "Custom domain": t('features.customDomain'),
      "Remove branding": t('features.removeBranding'),
      "Email support": t('features.emailSupport'),
      "Priority support": t('features.prioritySupport'),
      "Custom themes": t('features.customThemes'),
      "API access": t('features.apiAccess'),
    };
    
    return featureMap[featureName] || featureName;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/5 to-chart-4/10" />
          <div className="container relative mx-auto px-4 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                {t('hero.badge')}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Early Bird Notice */}
        {EARLY_BIRD_OFFER.enabled && (
          <section className="py-6 bg-gradient-to-r from-chart-1/20 via-chart-2/20 to-chart-4/20 border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 text-lg md:text-xl font-semibold">
                  <Sparkles className="h-5 w-5 text-chart-1" />
                  <span>{t('earlyBird.title')}</span>
                </div>
                <p className="text-muted-foreground mt-2">
                  {t('earlyBird.description')}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Billing Toggle */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-full">
                <button className="px-6 py-2 rounded-full bg-background shadow-sm text-sm font-medium">
                  {t('billing.monthly')}
                </button>
                <button className="px-6 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {t('billing.annual')}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {t('billing.saveText', { percentage: ANNUAL_DISCOUNT_PERCENTAGE })}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {PLANS.map((plan) => {
                  const isPopular = plan.popular;
                  
                  // Get prices for current currency
                  const priceMonthly = plan.prices[currencyCode].monthly;
                  const priceYearly = plan.prices[currencyCode].yearly;
                  
                  // Get translated plan info
                  const planName = t(`plan.${plan.id}.name`);
                  const planDescription = t(`plan.${plan.id}.description`);
                  const planCta = t(`plan.${plan.id}.cta`);
                  const planHighlight = plan.popular ? t(`plan.${plan.id}.highlight`) : '';
                  
                  return (
                    <Card 
                      key={plan.id}
                      className={`relative flex flex-col ${
                        isPopular 
                          ? 'border-primary shadow-xl scale-105 lg:scale-105' 
                          : 'hover:shadow-md'
                      } transition-all duration-300`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold shadow-lg border-0">
                            {planHighlight}
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="space-y-4 pb-8">
                        <div className="space-y-2">
                          <CardTitle className="text-2xl">{planName}</CardTitle>
                          <CardDescription className="text-base">
                            {planDescription}
                          </CardDescription>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold tracking-tight">
                              {formatPrice(priceMonthly)}
                            </span>
                            {priceMonthly > 0 && (
                              <span className="text-muted-foreground">{t('plan.perMonth')}</span>
                            )}
                          </div>
                          {priceMonthly > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {t('plan.orYearly', { 
                                price: formatPrice(priceYearly), 
                                savings: formatPrice((priceMonthly * 12) - priceYearly)
                              })}
                            </p>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Button 
                          asChild 
                          size="lg" 
                          className="w-full h-12 text-base font-semibold"
                          variant={isPopular ? 'default' : 'outline'}
                        >
                          <Link href={plan.ctaHref}>
                            {planCta}
                          </Link>
                        </Button>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-1 pb-8">
                        <p className="text-sm font-semibold text-foreground mb-4">
                          {t('plan.whatsIncluded')}
                        </p>
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                              {feature.included ? (
                                <Check className="h-5 w-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                              ) : (
                                <X className="h-5 w-5 text-muted-foreground/50 shrink-0 mt-0.5" />
                              )}
                              <span className={`text-sm ${
                                feature.included 
                                  ? 'text-foreground' 
                                  : 'text-muted-foreground/70 line-through'
                              }`}>
                                {getFeatureLabel(feature.name, plan.id)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Section */}
        <section className="py-20 md:py-32 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('allPlans.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('allPlans.title')}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t('allPlans.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: "🎨", key: "templates" },
                  { icon: "📱", key: "mobile" },
                  { icon: "⚡", key: "instant" },
                  { icon: "🔗", key: "qr" },
                  { icon: "🌐", key: "multilang" },
                  { icon: "📊", key: "analytics" },
                ].map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-all">
                    <CardHeader className="space-y-3">
                      <div className="text-4xl">{feature.icon}</div>
                      <CardTitle className="text-xl">
                        {t(`allPlans.items.${feature.key}.title`)}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {t(`allPlans.items.${feature.key}.description`)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32 border-t bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('faq.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('faq.title')}
                </h2>
              </div>

              <div className="space-y-6">
                {['switch', 'limit', 'refunds', 'domain', 'payment', 'setup'].map((faqKey) => (
                  <Card key={faqKey} className="hover:shadow-sm transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t(`faq.items.${faqKey}.question`)}
                      </CardTitle>
                      <CardDescription className="text-base pt-2">
                        {t(`faq.items.${faqKey}.answer`)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-8">
                <p className="text-muted-foreground">
                  {t('faq.contact.text')}{" "}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    {t('faq.contact.link')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 md:py-40 relative overflow-hidden border-t">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-4/10" />
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                {t('cta.badge')}
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="text-base px-8 py-6 h-auto">
                  <Link href="/auth/signup">
                    {t('cta.startButton')}
                    <Zap className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 h-auto">
                  <Link href="/contact">{t('cta.contactButton')}</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
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
