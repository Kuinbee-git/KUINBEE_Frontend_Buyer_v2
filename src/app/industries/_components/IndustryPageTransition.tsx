"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/components/router/Link";
import "./IndustryPageTransition.css";

const industryPaths = new Set([
  "/industries/egocentric",
  "/industries/healthcare",
  "/industries/voice",
]);
const IndustryNavigationContext = createContext<
  ((href: string) => void) | null
>(null);

type PendingNavigation = {
  resolve: () => void;
  transition: ViewTransition | null;
  timeout: ReturnType<typeof setTimeout> | null;
};

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateArrival() {
  if (reducedMotion()) return;
  document.querySelector<HTMLElement>("[data-industry-content]")?.animate(
    [
      { opacity: 0, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );
}

export function IndustryPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const previousPathname = useRef(pathname);
  const pending = useRef<PendingNavigation | null>(null);

  const clearPending = useCallback((navigation: PendingNavigation) => {
    if (navigation.timeout) clearTimeout(navigation.timeout);
    navigation.resolve();
    if (pending.current === navigation) {
      pending.current = null;
      document.documentElement.removeAttribute("data-industry-transition");
    }
  }, []);

  useLayoutEffect(() => {
    const previous = previousPathname.current;
    previousPathname.current = pathname;
    if (previous === pathname) return;

    // Resolve only after the destination DOM has committed, not after push().
    if (pending.current) {
      pending.current.resolve();
    } else if (industryPaths.has(previous) && industryPaths.has(pathname)) {
      // Also cover browser history and browsers without view transitions.
      animateArrival();
    }
  }, [pathname]);

  useEffect(
    () => () => {
      if (pending.current) {
        pending.current.transition?.skipTransition();
        clearPending(pending.current);
      }
    },
    [clearPending]
  );

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || pending.current) return;
      if (
        !industryPaths.has(href) ||
        reducedMotion() ||
        !document.startViewTransition
      ) {
        router.push(href);
        return;
      }

      let resolveCommit = () => {};
      const committed = new Promise<void>((resolve) => {
        resolveCommit = resolve;
      });
      const navigation: PendingNavigation = {
        resolve: resolveCommit,
        transition: null,
        timeout: null,
      };
      pending.current = navigation;
      document.documentElement.setAttribute("data-industry-transition", "true");

      try {
        const transition = document.startViewTransition(() => {
          router.push(href);
          return committed;
        });
        navigation.transition = transition;
        // A slow request must not hold a frozen screenshot over the live page.
        navigation.timeout = setTimeout(() => {
          transition.skipTransition();
          clearPending(navigation);
        }, 1600);
        void transition.ready.catch(() => {});
        void transition.finished.then(
          () => clearPending(navigation),
          () => clearPending(navigation)
        );
      } catch {
        clearPending(navigation);
        router.push(href);
      }
    },
    [clearPending, pathname, router]
  );

  return (
    <IndustryNavigationContext.Provider value={navigate}>
      {children}
    </IndustryNavigationContext.Provider>
  );
}

type IndustryLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onNavigate"
> & {
  href: string;
};

export function IndustryLink({ href, ...props }: IndustryLinkProps) {
  const navigate = useContext(IndustryNavigationContext);
  return (
    <Link
      {...props}
      href={href}
      prefetch
      onNavigate={(event) => {
        if (!navigate) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}
