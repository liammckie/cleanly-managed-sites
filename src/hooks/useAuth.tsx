
import React, { useContext } from 'react';
import { AuthContext } from './auth/AuthProvider';
import { AuthContextType } from './auth/types';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
