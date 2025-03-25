
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to CleanSites</h1>
        <p className="text-xl text-gray-600">Commercial cleaning site management</p>
        
        <div className="flex flex-col space-y-4 mt-8">
          {user ? (
            <Button onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
              <p className="text-sm text-gray-500">
                New to CleanSites? <a href="/login" className="text-primary hover:underline">Create an account</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
