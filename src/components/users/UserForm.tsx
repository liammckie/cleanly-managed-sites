
import { UserRole } from '@/lib/types/userTypes';

// Fix for handleRoleChange function
const handleRoleChange = (selectedRole: string | UserRole) => {
  if (typeof selectedRole === 'string') {
    const roleMatch = roles.find(r => r.id === selectedRole);
    setForm(prev => ({ ...prev, role_id: selectedRole }));
  } else {
    setForm(prev => ({ ...prev, role_id: selectedRole.id }));
  }
};
