"use client";

import * as React from "react";
import { Link } from "@/components/router/Link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/shared/utils/cn";
import type { NavItem } from "@/config/navigation.config";

export interface NavDropdownProps {
  label: string;
  items: NavItem[];
  align?: "start" | "center" | "end";
}

export function NavDropdown({ label, items, align = "start" }: NavDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1 text-sm font-medium transition-colors duration-200",
            "text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white focus:outline-none",
            open && "text-foreground dark:text-white"
          )}
        >
          {label}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} sideOffset={12} className="w-72 p-2">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
          <DropdownMenuItem key={item.name} asChild>
            <Link
              href={item.href}
              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent">
                {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
