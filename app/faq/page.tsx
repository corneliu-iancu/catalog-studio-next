import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sparkles, HelpCircle, CreditCard, Palette, ShoppingBag, LifeBuoy } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function FAQPage() {
  const t = await getTranslations('faq');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const categories = [
    {
      id: 'general',
      icon: HelpCircle,
      title: t('categories.general.title'),
      gradient: 'from-blue-500 to-cyan-500',
      questions: ['whatIs', 'howWorks', 'whoFor', 'languages']
    },
    {
      id: 'pricing',
      icon: CreditCard,
      title: t('categories.pricing.title'),
      gradient: 'from-green-500 to-emerald-500',
      questions: ['freeTrial', 'paymentMethods', 'cancelAnytime', 'refunds']
    },
    {
      id: 'features',
      icon: Sparkles,
      title: t('categories.features.title'),
      gradient: 'from-purple-500 to-pink-500',
      questions: ['updateMenu', 'qrCode', 'multipleRestaurants', 'customDomain']
    },
    {
      id: 'technical',
      icon: Palette,
      title: t('categories.technical.title'),
      gradient: 'from-orange-500 to-red-500',
      questions: ['needApp', 'templates', 'imageUpload', 'dataBackup']
    },
    {
      id: 'support',
      icon: LifeBuoy,
      title: t('categories.support.title'),
      gradient: 'from-indigo-500 to-purple-500',
      questions: ['getHelp', 'trainingAvailable', 'setupHelp', 'responseTime']
    },
  ];

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

        {/* Quick Stats */}
        <section className="py-12 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">9-18</div>
                  <p className="text-sm text-muted-foreground">{t('stats.businessHours')}</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">&lt; 2h</div>
                  <p className="text-sm text-muted-foreground">{t('stats.responseTime')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              {categories.map((category, categoryIndex) => (
                <div key={category.id} className="space-y-8">
                  {/* Category Header */}
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} shadow-md shrink-0`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {category.title}
                      </h2>
                    </div>
                  </div>

                  {/* Questions Accordion */}
                  <Card className="border-2">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((questionKey, index) => (
                          <AccordionItem 
                            key={questionKey} 
                            value={`${category.id}-${questionKey}`}
                            className={index === category.questions.length - 1 ? 'border-b-0' : ''}
                          >
                            <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/50 transition-colors text-left">
                              <span className="text-base font-semibold pr-4">
                                {t(`categories.${category.id}.questions.${questionKey}.question`)}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-5 pt-0">
                              <div className="text-base text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                                {t(`categories.${category.id}.questions.${questionKey}.answer`)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="py-20 md:py-32 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="border-primary/20 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-4/5 shadow-lg">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <HelpCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                      {t('stillQuestions.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      {t('stillQuestions.subtitle')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button asChild size="lg" className="text-base px-8 h-12">
                      <Link href="/contact">
                        {t('stillQuestions.contactButton')}
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-base px-8 h-12">
                      <Link href="/auth/signup">
                        {t('stillQuestions.tryButton')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 h-auto">
                  <Link href="/plans">{t('cta.plansButton')}</Link>
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
