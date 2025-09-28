'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage('Check your email for a password reset link. If you don\'t see it, check your spam folder.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Reset your password</h1>
          <p className="text-white/80 drop-shadow">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        {/* Reset Password Card - Glass Design */}
        <Card className="border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 pointer-events-none"></div>
          <CardHeader className="space-y-1 pb-4 relative z-10">
            <CardTitle className="text-2xl text-center text-white drop-shadow">Forgot Password</CardTitle>
            <CardDescription className="text-center text-white/80 drop-shadow">
              We'll help you get back into your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">

            {/* Success Message */}
            {message && (
              <div className="bg-green-500/20 text-green-100 text-sm p-3 rounded-md border border-green-400/30 backdrop-blur-sm">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded-md border border-red-400/30 backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 drop-shadow">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                  disabled={loading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-white/30" />
              <span className="text-xs uppercase text-white/80 drop-shadow whitespace-nowrap">
                Or
              </span>
              <Separator className="flex-1 bg-white/30" />
            </div>

            {/* Navigation Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-white/80 drop-shadow">
                Remember your password?{' '}
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-white/80 hover:underline font-medium drop-shadow"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-white/80 drop-shadow">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-white hover:text-white/80 hover:underline font-medium drop-shadow"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>

        {/* What happens next */}
        <Card className="border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 pointer-events-none"></div>
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-lg text-white drop-shadow">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <ol className="space-y-2 text-sm text-white/80 drop-shadow">
              <li className="flex items-start">
                <span className="text-white font-medium mr-2 drop-shadow">1.</span>
                <span>We'll send a password reset link to your email</span>
              </li>
              <li className="flex items-start">
                <span className="text-white font-medium mr-2 drop-shadow">2.</span>
                <span>Click the link in the email (check your spam folder too)</span>
              </li>
              <li className="flex items-start">
                <span className="text-white font-medium mr-2 drop-shadow">3.</span>
                <span>Create a new password for your account</span>
              </li>
              <li className="flex items-start">
                <span className="text-white font-medium mr-2 drop-shadow">4.</span>
                <span>Sign in with your new password</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-white/80 hover:text-white transition-colors drop-shadow"
          >
            ← Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
