import type { ReactNode } from "react";

export function StatPill({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-md">
      {icon}
      <div className="leading-tight">
        <div className="font-display font-extrabold text-sm tabular-nums">
          {value}
        </div>
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
