
// Update the contract history insert
await supabase
  .from('site_contract_history')
  .insert({
    site_id: contract.site_id,
    contract_details: contract.contract_details,
    notes: contract.notes,
    created_by: userId,
    version_number: 1 // Add the missing field
  });
