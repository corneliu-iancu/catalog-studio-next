import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with the Catalog Studio team
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input type="text" id="name" name="name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" name="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restaurant">Restaurant Name (if applicable)</Label>
                  <Input type="text" id="restaurant" name="restaurant" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select name="subject" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={5} required />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                <div>
                  <h3 className="text-lg font-semibold mb-3">Email Support</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">General Support:</span>
                      <span className="text-muted-foreground">support@catalogstudio.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Technical Issues:</span>
                      <span className="text-muted-foreground">tech@catalogstudio.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Billing Questions:</span>
                      <span className="text-muted-foreground">billing@catalogstudio.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Partnerships:</span>
                      <span className="text-muted-foreground">partners@catalogstudio.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Phone Support</h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">1-800-CATALOG (1-800-228-2564)</p>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM EST</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Mailing Address</h3>
                  <address className="text-sm text-muted-foreground not-italic">
                    Catalog Studio<br />
                    123 Restaurant Row<br />
                    Suite 456<br />
                    Food City, FC 12345<br />
                    United States
                  </address>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Before reaching out, you might find your answer in our FAQ section.
                  Common topics include account setup, menu management, pricing, and technical troubleshooting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Response Times</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">Email:</span>
                    <span className="text-muted-foreground">We typically respond within 24 hours during business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">Phone:</span>
                    <span className="text-muted-foreground">Immediate assistance during business hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">Technical Issues:</span>
                    <span className="text-muted-foreground">Priority support for urgent technical problems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Contact Us - Catalog Studio',
  description: 'Get in touch with Catalog Studio for support, questions, or partnership opportunities.',
};
