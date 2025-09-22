import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">

                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Catalog Studio, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Restaurant Account Registration</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To use our restaurant management features, you must register for an account and provide accurate information.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. Menu Content and Responsibility</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Restaurants are responsible for the accuracy of their menu content, pricing, and availability information.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Platform Usage</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to use the platform only for lawful purposes and in accordance with these terms.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The platform and its original content remain the property of Catalog Studio.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Catalog Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these terms.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{" "}
                    <Link href="mailto:legal@catalogstudio.com" className="text-primary hover:underline">
                      legal@catalogstudio.com
                    </Link>
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Terms of Service - Catalog Studio',
  description: 'Terms of Service for Catalog Studio restaurant menu management platform.',
};
