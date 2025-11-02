import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { APP_CONFIG } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const t = await getTranslations('terms');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const lastUpdated = new Date('2025-11-02'); // Update this date when terms change

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          {/* Simple Header - No hero, just clean typography */}
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('lastUpdated', { date: lastUpdated.toLocaleDateString(currentLocale === 'ro' ? 'ro-RO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })}
            </p>
          </div>

          {/* Two-column layout: ToC on left, content on right */}
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[280px_1fr] gap-16">
              {/* Table of Contents - Sticky */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-1">
                  <p className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                    {t('tableOfContents')}
                  </p>
                  <nav className="space-y-1">
                    {['acceptance', 'definitions', 'account', 'subscription', 'usage', 'content', 'intellectual', 'termination', 'disclaimers', 'limitation', 'changes', 'contact'].map((section) => (
                      <a
                        key={section}
                        href={`#${section}`}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                      >
                        {t(`sections.${section}.title`)}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="max-w-3xl space-y-16">
                {/* Introduction */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t('introduction', { appName: APP_CONFIG.APP_NAME })}
                  </p>
                </div>

                {/* Sections */}
                <section id="acceptance" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.acceptance.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.acceptance.content1')}</p>
                    <p>{t('sections.acceptance.content2')}</p>
                  </div>
                </section>

                <section id="definitions" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.definitions.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.definitions.intro')}</p>
                    <ul className="space-y-3 pl-6">
                      <li><strong className="text-foreground">{t('sections.definitions.service.term')}</strong> — {t('sections.definitions.service.definition')}</li>
                      <li><strong className="text-foreground">{t('sections.definitions.user.term')}</strong> — {t('sections.definitions.user.definition')}</li>
                      <li><strong className="text-foreground">{t('sections.definitions.content.term')}</strong> — {t('sections.definitions.content.definition')}</li>
                      <li><strong className="text-foreground">{t('sections.definitions.account.term')}</strong> — {t('sections.definitions.account.definition')}</li>
                    </ul>
                  </div>
                </section>

                <section id="account" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.account.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.account.content1')}</p>
                    <p>{t('sections.account.content2')}</p>
                    <p>{t('sections.account.content3')}</p>
                  </div>
                </section>

                <section id="subscription" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.subscription.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.subscription.content1')}</p>
                    <p>{t('sections.subscription.content2')}</p>
                    <p>{t('sections.subscription.content3')}</p>
                  </div>
                </section>

                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.usage.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.usage.intro')}</p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li>{t('sections.usage.rule1')}</li>
                      <li>{t('sections.usage.rule2')}</li>
                      <li>{t('sections.usage.rule3')}</li>
                      <li>{t('sections.usage.rule4')}</li>
                      <li>{t('sections.usage.rule5')}</li>
                    </ul>
                  </div>
                </section>

                <section id="content" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.content.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.content.content1')}</p>
                    <p>{t('sections.content.content2')}</p>
                    <p>{t('sections.content.content3')}</p>
                  </div>
                </section>

                <section id="intellectual" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.intellectual.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.intellectual.content1')}</p>
                    <p>{t('sections.intellectual.content2')}</p>
                  </div>
                </section>

                <section id="termination" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.termination.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.termination.content1')}</p>
                    <p>{t('sections.termination.content2')}</p>
                  </div>
                </section>

                <section id="disclaimers" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.disclaimers.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p className="uppercase font-semibold text-foreground">{t('sections.disclaimers.content1')}</p>
                    <p>{t('sections.disclaimers.content2')}</p>
                  </div>
                </section>

                <section id="limitation" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.limitation.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.limitation.content1')}</p>
                    <p>{t('sections.limitation.content2')}</p>
                  </div>
                </section>

                <section id="changes" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.changes.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.changes.content1')}</p>
                    <p>{t('sections.changes.content2')}</p>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.contact.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.contact.content')}</p>
                    <p>
                      <strong className="text-foreground">{t('sections.contact.email')}</strong>{' '}
                      <a href={`mailto:${APP_CONFIG.LEGAL_EMAIL}`} className="text-primary hover:underline">
                        {APP_CONFIG.LEGAL_EMAIL}
                      </a>
                    </p>
                  </div>
                </section>

                {/* Footer Links */}
                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground">
                    {t('alsoSee')}{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      {t('privacyPolicy')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
