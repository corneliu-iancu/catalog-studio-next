import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about Catalog Studio
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create a restaurant account?</AccordionTrigger>
                  <AccordionContent>
                    Visit our <Link href="/auth/signup" className="text-primary hover:underline">registration page</Link> and fill out the form with your restaurant
                    information. You'll need to provide your restaurant name, a unique URL slug, and your contact details.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does it take to set up my menu?</AccordionTrigger>
                  <AccordionContent>
                    Most restaurants can have their basic menu online within 30 minutes. Adding detailed descriptions,
                    images, and nutritional information may take longer depending on your menu size.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I use my own domain name?</AccordionTrigger>
                  <AccordionContent>
                    Currently, all restaurants use our platform domain with your chosen slug (e.g., yoursite.com/your-restaurant).
                    Custom domain mapping may be available in future plans.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Menu Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Menu Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I add items to my menu?</AccordionTrigger>
                  <AccordionContent>
                    Once logged in, go to your dashboard and navigate to Menu Management. You can add categories first,
                    then add individual items to each category with descriptions, prices, and images.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I update prices and availability in real-time?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Changes to your menu are reflected immediately on your public restaurant page.
                    You can update prices, descriptions, and mark items as unavailable anytime.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What image formats are supported?</AccordionTrigger>
                  <AccordionContent>
                    We support JPG, PNG, and WebP formats. For best results, use high-quality images with a 1:1 aspect ratio
                    (square) and at least 800x800 pixels.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Can customers place orders through the platform?</AccordionTrigger>
                  <AccordionContent>
                    Currently, Catalog Studio focuses on menu display and discovery. Order functionality may be added in future updates.
                    You can include contact information for customers to call or visit your restaurant.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Do you provide analytics?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Your dashboard includes analytics showing menu views, popular items, and customer engagement metrics
                    to help you understand what resonates with your audience.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is the platform mobile-friendly?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! All restaurant pages are fully responsive and optimized for mobile devices,
                    ensuring customers have a great experience on any device.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Account & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Account & Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How much does Catalog Studio cost?</AccordionTrigger>
                  <AccordionContent>
                    We offer flexible pricing plans to suit restaurants of all sizes. Contact our sales team for current pricing
                    and to find the plan that best fits your needs.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I cancel my account anytime?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can cancel your account at any time from your dashboard settings.
                    Your menu will remain accessible until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens to my data if I cancel?</AccordionTrigger>
                  <AccordionContent>
                    You can export your menu data before canceling. After cancellation, your data is retained for 30 days
                    in case you want to reactivate, then permanently deleted.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Technical Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Technical Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>I forgot my password. How do I reset it?</AccordionTrigger>
                  <AccordionContent>
                    Use our <Link href="/auth/forgot-password" className="text-primary hover:underline">password reset page</Link> to receive a reset link via email.
                    Check your spam folder if you don't see the email within a few minutes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>My images aren't uploading. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    Ensure your images are under 5MB and in JPG, PNG, or WebP format.
                    If problems persist, try clearing your browser cache or contact support.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I contact support?</AccordionTrigger>
                  <AccordionContent>
                    You can reach our support team via email at support@catalogstudio.com,
                    phone at 1-800-CATALOG, or through our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Still Have Questions Section */}
      <div className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
              <CardDescription>
                If you can't find the answer you're looking for, don't hesitate to reach out to our support team.
                We're here to help you succeed!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'FAQ - Catalog Studio',
  description: 'Frequently asked questions about Catalog Studio restaurant menu management platform.',
};
