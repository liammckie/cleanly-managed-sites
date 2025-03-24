
// This file ensures proper JSX runtime environment
(() => {
  try {
    // Check if React is available
    if (typeof React === 'undefined') {
      console.warn('React not found in global scope');
    }
    
    // Check if JSX runtime is available
    if (typeof React !== 'undefined' && typeof React.createElement !== 'function') {
      console.warn('React.createElement is not available');
    }
    
    // Log success if everything is ok
    if (typeof React !== 'undefined' && typeof React.createElement === 'function') {
      console.log('JSX runtime environment looks good');
    }
  } catch (e) {
    console.error('Error checking JSX runtime:', e);
  }
})();
