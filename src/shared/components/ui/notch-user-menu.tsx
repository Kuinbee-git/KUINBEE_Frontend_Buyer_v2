"use client";

import * as React from "react";
import { Link } from "@/components/router/Link";
import { User, FolderOpen, LogOut } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface NotchUserMenuProps {
  onLogout: () => void;
}

export function NotchUserMenu({ onLogout }: NotchUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white"
        >
          <User className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="p-0 border-border/40 dark:border-white/10 bg-background/95 dark:bg-[#1e2847]/95 backdrop-blur-xl"
      >
        <DropdownMenuItem asChild>
          <Link href="/my-datasets" className="cursor-pointer">
            <FolderOpen className="h-4 w-4 mr-2" />
            My Datasets
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
