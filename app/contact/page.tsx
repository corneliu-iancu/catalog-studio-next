import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Clock, Send, HelpCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const t = await getTranslations('contact');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const contactMethods = [
    {
      icon: Mail,
      title: t('methods.email.title'),
      description: t('methods.email.description'),
      value: "hello@catalogstudio.com",
      href: "mailto:hello@catalogstudio.com",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: t('methods.phone.title'),
      description: t('methods.phone.description'),
      value: "+40 123 456 789",
      href: "tel:+40123456789",
      gradient: "from-purple-500 to-pink-500"
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

        {/* Contact Methods */}
        <section className="py-20 border-b bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('methods.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('methods.title')}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t('methods.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {contactMethods.map((method, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative space-y-4 pb-4">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${method.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                        <method.icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{method.title}</CardTitle>
                      <CardDescription className="text-base">
                        {method.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <a 
                        href={method.href}
                        className="text-primary hover:underline font-medium text-base"
                      >
                        {method.value}
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Response Time Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-chart-1/5 via-chart-2/5 to-chart-4/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{t('responseTime.title')}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {t('responseTime.description')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 md:py-32 bg-muted/30 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('form.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('form.title')}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t('form.subtitle')}
                </p>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('form.cardTitle')}</CardTitle>
                  <CardDescription className="text-base">
                    {t('form.cardDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('form.fields.firstName')}</Label>
                        <Input 
                          id="firstName" 
                          placeholder={t('form.placeholders.firstName')}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('form.fields.lastName')}</Label>
                        <Input 
                          id="lastName" 
                          placeholder={t('form.placeholders.lastName')}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.fields.email')}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={t('form.placeholders.email')}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('form.fields.subject')}</Label>
                      <Input 
                        id="subject" 
                        placeholder={t('form.placeholders.subject')}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('form.fields.message')}</Label>
                      <Textarea 
                        id="message" 
                        placeholder={t('form.placeholders.message')}
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <Button size="lg" className="w-full h-12 text-base font-semibold">
                      {t('form.submit')}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      {t('form.privacy')}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="text-sm px-4 py-1.5 font-medium">
                  {t('faq.badge')}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('faq.title')}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t('faq.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                {['sales', 'support', 'demo', 'pricing'].map((faqKey) => (
                  <Card key={faqKey} className="hover:shadow-sm transition-all">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-lg">
                            {t(`faq.items.${faqKey}.question`)}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {t(`faq.items.${faqKey}.answer`)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 md:py-40 relative overflow-hidden">
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
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 h-auto">
                  <Link href="/plans">{t('cta.plansButton')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
