import type React from "react";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export function SidebarButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
        active
          ? "bg-white/10 text-white"
          : "hover:bg-white/5 text-zinc-300 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      <span className="truncate">{label}</span>
    </button>
  );
}
