
import { useEffect, useState } from 'react';

/**
 * Custom hook to check if a media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);
    
    // Update matches when media query changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add event listener
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook to check if the screen is mobile size
 * Exported as both named export (useIsMobile) and default export (useMobile)
 * for backward compatibility and different import styles
 */
export const useIsMobile = (): boolean => {
  return useMediaQuery('(max-width: 768px)');
};

// Also export as default for backward compatibility
export default useIsMobile;
