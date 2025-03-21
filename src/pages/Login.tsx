
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/auth';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState<string | null>(null);
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  // Check for verification parameters in the URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('token') && url.searchParams.has('type')) {
      // The auth provider will handle verification
      setActiveTab('login');
    }
  }, []);
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signUp(email, password, name);
      // Switch to login tab after successful signup
      setActiveTab('login');
      setError('Please check your email to verify your account before logging in.');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await resetPassword(email);
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) return null; // Prevent flash of content when redirecting

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">CleanSites</h1>
          <p className="text-muted-foreground mt-2">Commercial cleaning site management</p>
        </div>
        
        <Card className="glass-card animate-slide-in">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {activeTab === "login" && (
              <LoginForm 
                onSubmit={handleLogin}
                onResetPassword={handleResetPassword}
                isLoading={isLoading}
                error={error}
              />
            )}
            
            {activeTab === "register" && (
              <RegisterForm
                onSubmit={handleSignup}
                isLoading={isLoading}
                error={error}
              />
            )}
          </CardContent>
          
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              By using our service, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
