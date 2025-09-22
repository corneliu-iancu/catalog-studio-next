import Link from 'next/link';
import { Suspense } from 'react';

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}

function ResetPasswordForm({ token, email }: { token?: string; email?: string }) {
  // If no token is provided, show error state
  if (!token) {
    return (
      <div>
        <header>
          <h1>Invalid Reset Link</h1>
          <p>This password reset link is invalid or has expired.</p>
        </header>

        <div>
          <p>Please request a new password reset link.</p>
          <Link href="/auth/forgot-password">Request New Reset Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Create New Password</h1>
        <p>Enter your new password below</p>
        {email && <p>Resetting password for: {email}</p>}
      </header>

      <form>
        {/* Hidden fields for form submission */}
        <input type="hidden" name="token" value={token} />
        {email && <input type="hidden" name="email" value={email} />}

        <div>
          <label htmlFor="password">New Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            minLength={8}
            required 
          />
          <small>Password must be at least 8 characters long</small>
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            minLength={8}
            required 
          />
        </div>

        <button type="submit">Update Password</button>
      </form>

      <div>
        <h2>Password Requirements</h2>
        <ul>
          <li>At least 8 characters long</li>
          <li>Include both uppercase and lowercase letters</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>

      <div>
        <p>
          <Link href="/auth/signin">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm token={params.token} email={params.email} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Reset Password - Catalog Studio',
  description: 'Create a new password for your restaurant account.',
};
