import Link from "next/link";
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('home');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">{t('footer.brand.name')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.brand.tagline')}</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('footer.product.title')}</h4>
            <ul className="space-y-3">
              <li><Link href="/plans" className="text-sm hover:text-primary transition-colors">{t('footer.product.plans')}</Link></li>
              <li><Link href="/auth/signup" className="text-sm hover:text-primary transition-colors">{t('footer.product.getStarted')}</Link></li>
              <li><Link href="/tonys-pizza" className="text-sm hover:text-primary transition-colors">{t('footer.product.liveDemo')}</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:text-primary transition-colors">{t('footer.product.dashboard')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('footer.company.title')}</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">{t('footer.company.about')}</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">{t('footer.company.contact')}</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-primary transition-colors">{t('footer.company.faq')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t('footer.legal.title')}</h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm hover:text-primary transition-colors">{t('footer.legal.privacy')}</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary transition-colors">{t('footer.legal.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('footer.brand.name')}. {t('footer.copyright')}
            </p>
            <div className="flex gap-6">
              <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.signIn')}</Link>
              <Link href="/auth/signup" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('footer.signUp')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

