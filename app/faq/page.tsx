import { cookies } from "next/headers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function FAQPage() {
  const cookieStore = await cookies();
  const currentLocale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLocale={currentLocale} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does Catalog Studio work?</AccordionTrigger>
                <AccordionContent>
                  Catalog Studio is a digital menu platform that allows restaurants to create, manage, and share their menus online. Customers can view your menu by scanning a QR code or visiting your unique restaurant URL.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                  Yes! We offer a free trial so you can test all features before committing to a paid plan.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I update my menu anytime?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! You can update your menu items, prices, and descriptions at any time from your dashboard. Changes are reflected immediately.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Do customers need to download an app?</AccordionTrigger>
                <AccordionContent>
                  No! Your digital menu is accessible through any web browser. Customers simply scan your QR code or visit your URL.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

