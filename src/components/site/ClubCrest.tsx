import { useEffect, useState } from "react";

interface ClubCrestProps {
  shortName: string;
  color?: string | null;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "size-8 text-[10px]",
  md: "size-12 text-xs",
  lg: "size-16 text-sm",
  xl: "size-24 text-lg",
};

export function ClubCrest({ shortName, color, logoUrl, size = "md", className = "" }: ClubCrestProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [logoUrl]);

  if (logoUrl && !errored) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center shrink-0 border-2 border-white/10 bg-white/5 overflow-hidden ${className}`}
      >
        <img
          src={logoUrl}
          alt={`${shortName} logo`}
          loading="lazy"
          onError={() => setErrored(true)}
          className="size-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-display font-extrabold tracking-tighter text-white shrink-0 border-2 border-white/10 ${className}`}
      style={{ backgroundColor: color ?? "#E10600" }}
    >
      {shortName}
    </div>
  );
}
