import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LoginForm = ({ onSubmit, onResetPassword, isLoading, error }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('verified') && url.searchParams.get('verified') === 'true') {
      setVerificationMessage('Your email has been verified. You can now log in.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setVerificationMessage('Please enter your email address to reset your password.');
      return;
    }
    
    setIsResetPasswordLoading(true);
    try {
      await onResetPassword(email);
      setVerificationMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {verificationMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-700">{verificationMessage}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button 
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-primary hover:underline"
              disabled={isResetPasswordLoading}
            >
              {isResetPasswordLoading ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size={16} />
              <span>Logging in...</span>
            </span>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </>
  );
};

export default LoginForm;
