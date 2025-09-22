import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-8">

                <div>
                  <h2 className="text-2xl font-semibold mb-6">1. Information We Collect</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Restaurant Account Information</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Restaurant name and description</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Owner contact information (name, email, phone)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Menu content and pricing</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Usage Information</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>How you interact with our platform</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Pages visited and features used</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>Device and browser information</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To provide and maintain our service</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To process restaurant registrations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To display restaurant menus to customers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To communicate with restaurant owners</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To improve our platform</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>

                  <h3 className="text-lg font-medium mb-3">Public Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Restaurant names, menus, and descriptions are displayed publicly to customers browsing the platform.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar technologies to enhance your experience and analyze platform usage.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Access your personal information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Correct inaccurate information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Delete your account and associated data</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Export your menu data</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this Privacy Policy, please contact us at{" "}
                    <Link href="mailto:privacy@catalogstudio.com" className="text-primary hover:underline">
                      privacy@catalogstudio.com
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
  title: 'Privacy Policy - Catalog Studio',
  description: 'Privacy Policy for Catalog Studio restaurant menu management platform.',
};
