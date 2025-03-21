import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    const typeParam = searchParams.get('type');
    const emailParam = searchParams.get('email');
    
    if (tokenParam && typeParam === 'recovery' && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError('Invalid or missing reset password parameters');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      setError('Missing email or token');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await verifyOtp(email, token, password);
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/login')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
        
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Reset Password
            </CardTitle>
            <CardDescription>
              Create a new password for your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!email || !token ? (
              <Alert className="mb-4">
                <AlertDescription>
                  This password reset link is invalid or has expired. Please request a new password reset.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Resetting Password...</span>
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
