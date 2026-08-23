import { Link } from "@tanstack/react-router";

export function SectionTitle({
  title,
  link,
  linkLabel,
  small,
}: {
  title: string;
  link?: string;
  linkLabel?: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <h2
        className={`font-display font-extrabold tracking-tight ${
          small ? "text-2xl" : "text-3xl md:text-4xl"
        }`}
      >
        <span className="border-l-4 border-korat-red pl-3">{title}</span>
      </h2>
      {link && (
        <Link
          to={link as any}
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-korat-red"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
