
// Re-export the auth provider and hooks from the auth folder
// This simplifies imports and ensures consistent auth handling
import { AuthProvider, useAuth } from './auth';

export { AuthProvider, useAuth };
