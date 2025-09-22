export default function PrivacyPage() {
  return (
    <div>
      <header>
        <h1>Privacy Policy</h1>
        <p>Last updated: [Date]</p>
      </header>

      <section>
        <h2>1. Information We Collect</h2>
        <h3>Restaurant Account Information</h3>
        <ul>
          <li>Restaurant name and description</li>
          <li>Owner contact information (name, email, phone)</li>
          <li>Menu content and pricing</li>
        </ul>
        
        <h3>Usage Information</h3>
        <ul>
          <li>How you interact with our platform</li>
          <li>Pages visited and features used</li>
          <li>Device and browser information</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our service</li>
          <li>To process restaurant registrations</li>
          <li>To display restaurant menus to customers</li>
          <li>To communicate with restaurant owners</li>
          <li>To improve our platform</li>
        </ul>
      </section>

      <section>
        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>Public Information</h3>
        <p>Restaurant names, menus, and descriptions are displayed publicly to customers browsing the platform.</p>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      </section>

      <section>
        <h2>5. Cookies and Tracking</h2>
        <p>We use cookies and similar technologies to enhance your experience and analyze platform usage.</p>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and associated data</li>
          <li>Export your menu data</li>
        </ul>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at privacy@catalogstudio.com</p>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Privacy Policy - Catalog Studio',
  description: 'Privacy Policy for Catalog Studio restaurant menu management platform.',
};
