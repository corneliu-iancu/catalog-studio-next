'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user && authData.session) {
        // User is signed up and session is active, redirect to dashboard
        router.push('/dashboard');
        router.refresh();
      } else {
        // Email confirmation required
        setError('Please check your email to verify your account, then sign in.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">Create your account</h1>
          <p className="text-white/80 drop-shadow">
            Join Catalog Studio and start showcasing your restaurant
          </p>
        </div>

        {/* Sign Up Card - Glass Design */}
        <Card className="border border-white/20 shadow-2xl backdrop-blur-md bg-white/10 relative overflow-hidden">
          {/* Glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 pointer-events-none"></div>
          <CardHeader className="space-y-1 pb-4 relative z-10">
            <CardTitle className="text-2xl text-center text-white drop-shadow">Sign Up</CardTitle>
            <CardDescription className="text-center text-white/80 drop-shadow">
              Create your restaurant account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded-md border border-red-400/30 backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white/90 drop-shadow">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 drop-shadow">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 drop-shadow">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Choose a secure password"
                  required
                  disabled={loading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/90 drop-shadow">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  disabled={loading}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  disabled={loading}
                  className="border-white/30 data-[state=checked]:bg-white/20 data-[state=checked]:border-white/50"
                />
                <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white/90 drop-shadow">
                  I agree to the{' '}
                  <Link href="/terms" className="text-white hover:text-white/80 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-white hover:text-white/80 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !acceptedTerms}
                size="lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Separator className="flex-1 bg-white/30" />
              <span className="text-xs uppercase text-white/80 drop-shadow whitespace-nowrap">
                Already have an account?
              </span>
              <Separator className="flex-1 bg-white/30" />
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-white/80 drop-shadow">
                <Link
                  href="/auth/signin"
                  className="text-white hover:text-white/80 hover:underline font-medium drop-shadow"
                >
                  Sign in to your account
                </Link>
              </p>
            </div>

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
