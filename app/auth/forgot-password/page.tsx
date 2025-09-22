import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div>
      <header>
        <h1>Reset Your Password</h1>
        <p>Enter your email address and we'll send you a link to reset your password</p>
      </header>

      <form>
        <div>
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your registered email"
            required 
          />
        </div>

        <button type="submit">Send Reset Link</button>
      </form>

      <div>
        <p>
          Remember your password? <Link href="/auth/signin">Sign in</Link>
        </p>
        <p>
          Don't have an account? <Link href="/auth/signup">Sign up</Link>
        </p>
      </div>

      <div>
        <h2>What happens next?</h2>
        <ol>
          <li>We'll send a password reset link to your email</li>
          <li>Click the link in the email (check your spam folder too)</li>
          <li>Create a new password for your account</li>
          <li>Sign in with your new password</li>
        </ol>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Forgot Password - Catalog Studio',
  description: 'Reset your password to regain access to your restaurant account.',
};
