
// Only updating the problematic section
const permissionDisplay = (permissions: string[] | Record<string, boolean>) => {
  if (Array.isArray(permissions)) {
    // Convert array to Record for display
    const permRecord: Record<string, boolean> = {};
    permissions.forEach(p => { permRecord[p] = true; });
    return permRecord;
  }
  return permissions as Record<string, boolean>;
};
