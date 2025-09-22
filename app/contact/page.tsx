export default function ContactPage() {
  return (
    <div>
      <header>
        <h1>Contact Us</h1>
        <p>Get in touch with the Catalog Studio team</p>
      </header>

      <section>
        <h2>Send Us a Message</h2>
        <form>
          <div>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div>
            <label htmlFor="restaurant">Restaurant Name (if applicable)</label>
            <input type="text" id="restaurant" name="restaurant" />
          </div>

          <div>
            <label htmlFor="subject">Subject</label>
            <select id="subject" name="subject" required>
              <option value="">Select a topic</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="feature">Feature Request</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required></textarea>
          </div>

          <button type="submit">Send Message</button>
        </form>
      </section>

      <section>
        <h2>Other Ways to Reach Us</h2>
        
        <div>
          <h3>Email Support</h3>
          <ul>
            <li><strong>General Support:</strong> support@catalogstudio.com</li>
            <li><strong>Technical Issues:</strong> tech@catalogstudio.com</li>
            <li><strong>Billing Questions:</strong> billing@catalogstudio.com</li>
            <li><strong>Partnerships:</strong> partners@catalogstudio.com</li>
          </ul>
        </div>

        <div>
          <h3>Phone Support</h3>
          <p><strong>1-800-CATALOG (1-800-228-2564)</strong></p>
          <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
          <p>Saturday: 10:00 AM - 4:00 PM EST</p>
          <p>Sunday: Closed</p>
        </div>

        <div>
          <h3>Mailing Address</h3>
          <address>
            Catalog Studio<br />
            123 Restaurant Row<br />
            Suite 456<br />
            Food City, FC 12345<br />
            United States
          </address>
        </div>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <p>
          Before reaching out, you might find your answer in our FAQ section. 
          Common topics include account setup, menu management, pricing, and technical troubleshooting.
        </p>
        <p><a href="/faq">View FAQ</a></p>
      </section>

      <section>
        <h2>Response Times</h2>
        <ul>
          <li><strong>Email:</strong> We typically respond within 24 hours during business days</li>
          <li><strong>Phone:</strong> Immediate assistance during business hours</li>
          <li><strong>Technical Issues:</strong> Priority support for urgent technical problems</li>
        </ul>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Contact Us - Catalog Studio',
  description: 'Get in touch with Catalog Studio for support, questions, or partnership opportunities.',
};
