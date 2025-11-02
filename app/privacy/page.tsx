import { cookies } from "next/headers";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { APP_CONFIG } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  const lastUpdated = new Date('2025-11-02'); // Update this date when privacy policy changes

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1 py-24">
        <div className="container mx-auto px-4">
          {/* Simple Header */}
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
                    {['introduction', 'information', 'usage', 'sharing', 'cookies', 'security', 'retention', 'rights', 'children', 'international', 'changes', 'contact'].map((section) => (
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
                    {t('intro', { appName: APP_CONFIG.APP_NAME })}
                  </p>
                </div>

                {/* Sections */}
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.introduction.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.introduction.content1')}</p>
                    <p>{t('sections.introduction.content2')}</p>
                  </div>
                </section>

                <section id="information" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.information.title')}
                  </h2>
                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {t('sections.information.provided.title')}
                      </h3>
                      <p>{t('sections.information.provided.content')}</p>
                      <ul className="space-y-2 pl-6 list-disc mt-3">
                        <li>{t('sections.information.provided.item1')}</li>
                        <li>{t('sections.information.provided.item2')}</li>
                        <li>{t('sections.information.provided.item3')}</li>
                        <li>{t('sections.information.provided.item4')}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {t('sections.information.automatic.title')}
                      </h3>
                      <p>{t('sections.information.automatic.content')}</p>
                      <ul className="space-y-2 pl-6 list-disc mt-3">
                        <li>{t('sections.information.automatic.item1')}</li>
                        <li>{t('sections.information.automatic.item2')}</li>
                        <li>{t('sections.information.automatic.item3')}</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.usage.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.usage.intro')}</p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li>{t('sections.usage.purpose1')}</li>
                      <li>{t('sections.usage.purpose2')}</li>
                      <li>{t('sections.usage.purpose3')}</li>
                      <li>{t('sections.usage.purpose4')}</li>
                      <li>{t('sections.usage.purpose5')}</li>
                      <li>{t('sections.usage.purpose6')}</li>
                    </ul>
                  </div>
                </section>

                <section id="sharing" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.sharing.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.sharing.content1')}</p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li><strong className="text-foreground">{t('sections.sharing.service.term')}</strong> — {t('sections.sharing.service.description')}</li>
                      <li><strong className="text-foreground">{t('sections.sharing.legal.term')}</strong> — {t('sections.sharing.legal.description')}</li>
                      <li><strong className="text-foreground">{t('sections.sharing.business.term')}</strong> — {t('sections.sharing.business.description')}</li>
                      <li><strong className="text-foreground">{t('sections.sharing.consent.term')}</strong> — {t('sections.sharing.consent.description')}</li>
                    </ul>
                  </div>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.cookies.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.cookies.content1')}</p>
                    <p>{t('sections.cookies.content2')}</p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li><strong className="text-foreground">{t('sections.cookies.essential.term')}</strong> — {t('sections.cookies.essential.description')}</li>
                      <li><strong className="text-foreground">{t('sections.cookies.preference.term')}</strong> — {t('sections.cookies.preference.description')}</li>
                      <li><strong className="text-foreground">{t('sections.cookies.analytics.term')}</strong> — {t('sections.cookies.analytics.description')}</li>
                    </ul>
                  </div>
                </section>

                <section id="security" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.security.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.security.content1')}</p>
                    <p>{t('sections.security.content2')}</p>
                  </div>
                </section>

                <section id="retention" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.retention.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.retention.content1')}</p>
                    <p>{t('sections.retention.content2')}</p>
                  </div>
                </section>

                <section id="rights" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.rights.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.rights.intro')}</p>
                    <ul className="space-y-2 pl-6 list-disc">
                      <li><strong className="text-foreground">{t('sections.rights.access.term')}</strong> — {t('sections.rights.access.description')}</li>
                      <li><strong className="text-foreground">{t('sections.rights.correction.term')}</strong> — {t('sections.rights.correction.description')}</li>
                      <li><strong className="text-foreground">{t('sections.rights.deletion.term')}</strong> — {t('sections.rights.deletion.description')}</li>
                      <li><strong className="text-foreground">{t('sections.rights.portability.term')}</strong> — {t('sections.rights.portability.description')}</li>
                      <li><strong className="text-foreground">{t('sections.rights.objection.term')}</strong> — {t('sections.rights.objection.description')}</li>
                    </ul>
                    <p className="mt-4">{t('sections.rights.exercise')}</p>
                  </div>
                </section>

                <section id="children" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.children.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.children.content1')}</p>
                    <p>{t('sections.children.content2')}</p>
                  </div>
                </section>

                <section id="international" className="scroll-mt-24">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">
                    {t('sections.international.title')}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>{t('sections.international.content1')}</p>
                    <p>{t('sections.international.content2')}</p>
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
                    <div className="space-y-2">
                      <p>
                        <strong className="text-foreground">{t('sections.contact.email')}</strong>{' '}
                        <a href={`mailto:${APP_CONFIG.PRIVACY_EMAIL}`} className="text-primary hover:underline">
                          {APP_CONFIG.PRIVACY_EMAIL}
                        </a>
                      </p>
                    </div>
                  </div>
                </section>

                {/* Footer Links */}
                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground">
                    {t('alsoSee')}{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      {t('termsOfService')}
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
