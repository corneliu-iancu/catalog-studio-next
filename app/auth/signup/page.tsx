import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div>
      <header>
        <h1>Restaurant Registration</h1>
        <p>Create your restaurant account to start managing your menu</p>
      </header>

      <form>
        {/* Restaurant Information */}
        <fieldset>
          <legend>Restaurant Information</legend>
          
          <div>
            <label htmlFor="restaurantName">Restaurant Name</label>
            <input 
              type="text" 
              id="restaurantName" 
              name="restaurantName" 
              required 
            />
          </div>

          <div>
            <label htmlFor="restaurantSlug">Restaurant URL Slug</label>
            <input 
              type="text" 
              id="restaurantSlug" 
              name="restaurantSlug" 
              placeholder="e.g., tonys-pizza"
              required 
            />
            <small>This will be your restaurant's URL: yoursite.com/your-slug</small>
          </div>

          <div>
            <label htmlFor="description">Restaurant Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
            ></textarea>
          </div>

          <div>
            <label htmlFor="cuisine">Cuisine Type</label>
            <select id="cuisine" name="cuisine">
              <option value="">Select cuisine type</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="mexican">Mexican</option>
              <option value="asian">Asian</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="other">Other</option>
            </select>
          </div>
        </fieldset>

        {/* Owner Information */}
        <fieldset>
          <legend>Owner Information</legend>
          
          <div>
            <label htmlFor="ownerName">Full Name</label>
            <input 
              type="text" 
              id="ownerName" 
              name="ownerName" 
              required 
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
            />
          </div>
        </fieldset>

        {/* Account Security */}
        <fieldset>
          <legend>Account Security</legend>
          
          <div>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              required 
            />
          </div>
        </fieldset>

        <div>
          <label>
            <input type="checkbox" name="terms" required />
            I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>
          </label>
        </div>

        <button type="submit">Create Restaurant Account</button>
      </form>

      <div>
        <p>
          Already have an account? <Link href="/auth/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Restaurant Registration - Catalog Studio',
  description: 'Register your restaurant to start showcasing your menu online.',
};
