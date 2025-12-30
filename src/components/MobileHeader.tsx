"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-[#09090b] border-b border-neutral-900/50">
      <h1 className="text-lg font-bold tracking-tight text-white">
        PRMS Admin
      </h1>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-800"
          >
            <Menu size={20} />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64 bg-[#09090b] border-r border-neutral-900/50"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar isMobile />
        </SheetContent>
      </Sheet>
    </div>
  );
}
