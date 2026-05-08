"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    lenisRef.current?.lenis?.scrollTo(0, {
      immediate: true,
      force: true,
    });
  }, [pathname]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        anchors: {
          offset: 96,
        },
        lerp: 0.08,
        syncTouch: false,
        wheelMultiplier: 0.9,
      }}
    >
      {children}
    </ReactLenis>
  );
}
