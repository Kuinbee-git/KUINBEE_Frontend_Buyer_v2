"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/components/router/Link";
import { useModal, useAuth } from "@/core/providers";
import { useNavigationConfig } from "@/hooks/useNavigationConfig";
import { resources } from "@/config/navigation.config";
import { Menu, Database, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./sheet";
import { cn } from "@/shared/utils/cn";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useModal();
  const { user } = useAuth();
  const navConfig = useNavigationConfig();

  const closeNav = () => setOpen(false);

  const handleSignup = () => {
    closeNav();
    openModal("signup");
  };

  const handleSignin = () => {
    closeNav();
    openModal("login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 p-0 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Database className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Kuinbee Registry</span>
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-1 py-4">
            {/* Back button if configured */}
            {navConfig.showBack && (
              navConfig.useBack ? (
                <button
                  onClick={() => { closeNav(); router.back(); }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full text-left"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {navConfig.backLabel || "Back"}
                </button>
              ) : (
                <Link
                  href={navConfig.backUrl || "/"}
                  onClick={closeNav}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {navConfig.backLabel || "Back"}
                </Link>
              )
            )}

            {/* Direct Links */}
            {navConfig.directLinks?.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeNav}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Resources Section */}
            {navConfig.dropdowns?.includes("resources") && (
              <>
                <div className="mt-4 px-2 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Resources
                  </span>
                </div>
                {resources.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeNav}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Mobile Auth Buttons */}
        {!user && (
          <div className="absolute inset-x-0 bottom-0 border-t bg-background p-4">
            <div className="flex flex-col gap-2">
              {navConfig.isSupplierPage ? (
                <Button
                  className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                  asChild
                >
                  <a href="https://calendly.com/ceo-kuinbee/30min" target="_blank" rel="noopener noreferrer">
                    Book a Demo
                  </a>
                </Button>
              ) : (
                <>
                  <Button
                    className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleSignin}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
