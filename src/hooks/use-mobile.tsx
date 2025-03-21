
import { useEffect, useState } from 'react';

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

// Export as named export for components that expect this naming
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

// Export as default for backward compatibility
export default function useMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
