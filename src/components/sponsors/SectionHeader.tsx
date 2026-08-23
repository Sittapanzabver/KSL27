export function SectionHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 bg-korat-red" />
        <span className="text-[10px] font-black tracking-[0.22em] text-korat-red uppercase">
          {kicker}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
        {title}
      </h2>
      {sub && (
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}
