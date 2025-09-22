export default function AboutPage() {
  return (
    <div>
      <header>
        <h1>About Catalog Studio</h1>
        <p>Empowering restaurants with modern menu management and showcase solutions</p>
      </header>

      <section>
        <h2>Our Mission</h2>
        <p>
          Catalog Studio is designed to help restaurants of all sizes create, manage, and showcase their menus online. 
          We believe every restaurant deserves a professional digital presence that reflects the quality of their food and service.
        </p>
      </section>

      <section>
        <h2>What We Offer</h2>
        <h3>For Restaurants</h3>
        <ul>
          <li>Easy-to-use menu management dashboard</li>
          <li>Professional menu presentation</li>
          <li>Custom restaurant URLs</li>
          <li>Menu analytics and insights</li>
          <li>Mobile-responsive design</li>
        </ul>

        <h3>For Customers</h3>
        <ul>
          <li>Browse restaurant menus online</li>
          <li>View detailed product information</li>
          <li>See ingredients and allergen information</li>
          <li>Access nutritional details</li>
          <li>Discover new restaurants</li>
        </ul>
      </section>

      <section>
        <h2>Why Choose Catalog Studio?</h2>
        <ul>
          <li><strong>Simple Setup:</strong> Get your restaurant online in minutes</li>
          <li><strong>Professional Design:</strong> Beautiful, mobile-friendly menu displays</li>
          <li><strong>Easy Management:</strong> Update your menu anytime, anywhere</li>
          <li><strong>Customer Focus:</strong> Help customers discover and explore your offerings</li>
          <li><strong>Affordable:</strong> Pricing that works for restaurants of all sizes</li>
        </ul>
      </section>

      <section>
        <h2>Getting Started</h2>
        <p>
          Ready to showcase your restaurant's menu online? 
          <a href="/auth/signup">Sign up today</a> and start building your digital menu presence.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          Have questions or need support? We're here to help!
        </p>
        <ul>
          <li>Email: support@catalogstudio.com</li>
          <li>Phone: 1-800-CATALOG</li>
          <li>Business Hours: Monday-Friday, 9 AM - 6 PM EST</li>
        </ul>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'About Us - Catalog Studio',
  description: 'Learn about Catalog Studio, the restaurant menu management and showcase platform.',
};
