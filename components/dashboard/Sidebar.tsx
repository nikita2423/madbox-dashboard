"use client";

import { useRouter, usePathname } from "next/navigation";
import { X, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  /** Optional override for active tab (used on pages that don't rely on pathname) */
  activeTab?: string;
  /** Legacy callback — kept for backward compat but routing is now handled via next/navigation */
  onTabChange?: (tab: string) => void;
}

const menuItems = [
  // {
  //   id: "dashboard",
  //   label: "Dashboard",
  //   icon: BarChart3,
  //   href: "/",
  // },
  {
    id: "download",
    label: "Download Data",
    icon: Download,
    href: "/",
  },
];

export function Sidebar({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  /** Determine which tab is active from the URL, falling back to the prop */
  const resolveActiveTab = (): string => {
    const matched = menuItems.find((item) => {
      if (item.href === "/") return pathname === "/";
      return pathname.startsWith(item.href);
    });
    return matched?.id ?? activeTab ?? "dashboard";
  };

  const currentTab = resolveActiveTab();

  const handleTabClick = (item: (typeof menuItems)[0]) => {
    onTabChange?.(item.id); // legacy callback
    router.push(item.href);
    onClose();
  };

  return (
    <TooltipProvider>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col items-center z-50",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo Area */}
        <div className="h-[72px] flex items-center justify-center w-full" />

        {/* Close button for mobile */}
        <div className="flex items-center justify-center p-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col items-center gap-4 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    id={`sidebar-tab-${item.id}`}
                    onClick={() => handleTabClick(item)}
                    aria-label={item.label}
                    className={cn(
                      "h-11 w-11 flex items-center justify-center rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-br from-[#C41E3A] to-[#1E3A8A] text-white shadow-md"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Footer Status Dot */}
        <div className="flex items-center justify-center p-3 border-t border-gray-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </TooltipTrigger>
            <TooltipContent side="right">System operational</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
