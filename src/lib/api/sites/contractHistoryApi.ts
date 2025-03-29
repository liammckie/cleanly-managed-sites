
// Only update the function with the error
export const saveContractVersion = async (
  siteId: string,
  contractDetails: any,
  notes: string = '',
  userId: string = 'system'
): Promise<boolean> => {
  try {
    // First get the latest version number
    const { data: latestVersions, error: versionError } = await supabase
      .from('contract_history')
      .select('version_number')
      .eq('site_id', siteId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionError) throw versionError;

    // Calculate the next version number
    const nextVersionNumber = latestVersions && latestVersions.length > 0
      ? (latestVersions[0].version_number || 0) + 1
      : 1;

    // Save the contract version with the calculated version number
    const { data, error } = await supabase
      .from('contract_history')
      .insert({
        site_id: siteId,
        contract_details: contractDetails,
        notes: notes,
        created_by: userId,
        version_number: nextVersionNumber
      });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error saving contract version:', error);
    return false;
  }
};
