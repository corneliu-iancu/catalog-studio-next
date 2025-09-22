'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    testConnection();
    checkUser();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection by trying to select from restaurants table
      const { data, error } = await supabase
        .from('restaurants')
        .select('count')
        .limit(1);
      
      if (error) {
        setConnectionStatus('error');
        setError(error.message);
      } else {
        setConnectionStatus('success');
      }
    } catch (err) {
      setConnectionStatus('error');
      setError('Failed to connect to Supabase');
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Supabase Connection Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Database Connection</h2>
        <p>Status: {connectionStatus}</p>
        {connectionStatus === 'success' && (
          <p style={{ color: 'green' }}>✅ Successfully connected to Supabase!</p>
        )}
        {connectionStatus === 'error' && (
          <p style={{ color: 'red' }}>❌ Connection failed: {error}</p>
        )}
        {connectionStatus === 'testing' && (
          <p style={{ color: 'orange' }}>🔄 Testing connection...</p>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Authentication Status</h2>
        {user ? (
          <div>
            <p style={{ color: 'green' }}>✅ User is signed in</p>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'orange' }}>👤 No user signed in</p>
            <p>
              <a href="/auth/signin">Sign In</a> | <a href="/auth/signup">Sign Up</a>
            </p>
          </div>
        )}
      </div>

      <div>
        <h2>Environment Variables</h2>
        <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
        <p>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Next Steps</h2>
        <ol>
          <li>Run the schema.sql in your Supabase SQL Editor</li>
          <li>Test sign up at <a href="/auth/signup">/auth/signup</a></li>
          <li>Test sign in at <a href="/auth/signin">/auth/signin</a></li>
          <li>Access dashboard at <a href="/dashboard">/dashboard</a></li>
        </ol>
      </div>
    </div>
  );
}
