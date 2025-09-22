import Link from 'next/link';

export default function SignInPage() {
  return (
    <div>
      <header>
        <h1>Sign In</h1>
        <p>Sign in to your restaurant account</p>
      </header>

      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
          />
        </div>

        <button type="submit">Sign In</button>
      </form>

      <div>
        <p>
          Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </p>
        <p>
          <Link href="/auth/forgot-password">Forgot your password?</Link>
        </p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Sign In - Catalog Studio',
  description: 'Sign in to your restaurant account to manage your menu and settings.',
};
