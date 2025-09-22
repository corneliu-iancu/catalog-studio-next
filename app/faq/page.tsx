export default function FAQPage() {
  return (
    <div>
      <header>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Catalog Studio</p>
      </header>

      <section>
        <h2>Getting Started</h2>
        
        <div>
          <h3>How do I create a restaurant account?</h3>
          <p>
            Visit our <a href="/auth/signup">registration page</a> and fill out the form with your restaurant 
            information. You'll need to provide your restaurant name, a unique URL slug, and your contact details.
          </p>
        </div>

        <div>
          <h3>How long does it take to set up my menu?</h3>
          <p>
            Most restaurants can have their basic menu online within 30 minutes. Adding detailed descriptions, 
            images, and nutritional information may take longer depending on your menu size.
          </p>
        </div>

        <div>
          <h3>Can I use my own domain name?</h3>
          <p>
            Currently, all restaurants use our platform domain with your chosen slug (e.g., yoursite.com/your-restaurant). 
            Custom domain mapping may be available in future plans.
          </p>
        </div>
      </section>

      <section>
        <h2>Menu Management</h2>
        
        <div>
          <h3>How do I add items to my menu?</h3>
          <p>
            Once logged in, go to your dashboard and navigate to Menu Management. You can add categories first, 
            then add individual items to each category with descriptions, prices, and images.
          </p>
        </div>

        <div>
          <h3>Can I update prices and availability in real-time?</h3>
          <p>
            Yes! Changes to your menu are reflected immediately on your public restaurant page. 
            You can update prices, descriptions, and mark items as unavailable anytime.
          </p>
        </div>

        <div>
          <h3>What image formats are supported?</h3>
          <p>
            We support JPG, PNG, and WebP formats. For best results, use high-quality images with a 1:1 aspect ratio 
            (square) and at least 800x800 pixels.
          </p>
        </div>
      </section>

      <section>
        <h2>Features</h2>
        
        <div>
          <h3>Can customers place orders through the platform?</h3>
          <p>
            Currently, Catalog Studio focuses on menu display and discovery. Order functionality may be added in future updates. 
            You can include contact information for customers to call or visit your restaurant.
          </p>
        </div>

        <div>
          <h3>Do you provide analytics?</h3>
          <p>
            Yes! Your dashboard includes analytics showing menu views, popular items, and customer engagement metrics 
            to help you understand what resonates with your audience.
          </p>
        </div>

        <div>
          <h3>Is the platform mobile-friendly?</h3>
          <p>
            Absolutely! All restaurant pages are fully responsive and optimized for mobile devices, 
            ensuring customers have a great experience on any device.
          </p>
        </div>
      </section>

      <section>
        <h2>Account & Billing</h2>
        
        <div>
          <h3>How much does Catalog Studio cost?</h3>
          <p>
            We offer flexible pricing plans to suit restaurants of all sizes. Contact our sales team for current pricing 
            and to find the plan that best fits your needs.
          </p>
        </div>

        <div>
          <h3>Can I cancel my account anytime?</h3>
          <p>
            Yes, you can cancel your account at any time from your dashboard settings. 
            Your menu will remain accessible until the end of your current billing period.
          </p>
        </div>

        <div>
          <h3>What happens to my data if I cancel?</h3>
          <p>
            You can export your menu data before canceling. After cancellation, your data is retained for 30 days 
            in case you want to reactivate, then permanently deleted.
          </p>
        </div>
      </section>

      <section>
        <h2>Technical Support</h2>
        
        <div>
          <h3>I forgot my password. How do I reset it?</h3>
          <p>
            Use our <a href="/auth/forgot-password">password reset page</a> to receive a reset link via email. 
            Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>

        <div>
          <h3>My images aren't uploading. What should I do?</h3>
          <p>
            Ensure your images are under 5MB and in JPG, PNG, or WebP format. 
            If problems persist, try clearing your browser cache or contact support.
          </p>
        </div>

        <div>
          <h3>How do I contact support?</h3>
          <p>
            You can reach our support team via email at support@catalogstudio.com, 
            phone at 1-800-CATALOG, or through our <a href="/contact">contact form</a>.
          </p>
        </div>
      </section>

      <section>
        <h2>Still Have Questions?</h2>
        <p>
          If you can't find the answer you're looking for, don't hesitate to reach out to our support team. 
          We're here to help you succeed!
        </p>
        <p><a href="/contact">Contact Support</a></p>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'FAQ - Catalog Studio',
  description: 'Frequently asked questions about Catalog Studio restaurant menu management platform.',
};
