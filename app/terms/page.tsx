import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function TermsPage() {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using Catalog Studio, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
                <p className="text-muted-foreground">
                  Permission is granted to temporarily use Catalog Studio for creating and managing digital restaurant menus. This is the grant of a license, not a transfer of title.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Service Modifications</h2>
                <p className="text-muted-foreground">
                  Catalog Studio reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Contact</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at hello@catalogstudio.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

