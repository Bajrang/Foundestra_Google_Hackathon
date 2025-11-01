import * as React from "react";

/**
 * Hook that detects if the current device is mobile based on screen width
 * @param breakpoint - The breakpoint in pixels to consider as mobile (default: 768)
 * @returns boolean indicating if the device is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkDevice();

    // Add event listener for resize
    window.addEventListener('resize', checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook that detects if the current device is tablet based on screen width
 * @returns boolean indicating if the device is tablet
 */
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isTablet;
}

/**
 * Hook that returns the current screen size category
 * @returns string indicating the screen size: 'mobile' | 'tablet' | 'desktop'
 */
export function useScreenSize(): 'mobile' | 'tablet' | 'desktop' {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return screenSize;
}