
// Only updating the problematic section
const handleRoleChange = (selectedRole: string | UserRole) => {
  if (typeof selectedRole === 'string') {
    const role = roles.find(r => r.id === selectedRole);
    setForm(prev => ({ ...prev, role_id: selectedRole }));
  } else {
    setForm(prev => ({ ...prev, role_id: selectedRole.id }));
  }
};
