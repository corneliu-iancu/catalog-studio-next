import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function PrivacyPage() {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
                <p className="text-muted-foreground">
                  At Catalog Studio, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information that you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, restaurant information, and menu data.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to ensure the security of our platform.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at hello@catalogstudio.com
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

