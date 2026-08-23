import { DIVISIONS, type DivisionKey } from "@/lib/divisions";

type Props = {
  active: DivisionKey;
  onChange: (key: DivisionKey) => void;
};

export function DivisionTab({ active, onChange }: Props) {
  const keys = Object.keys(DIVISIONS) as DivisionKey[];
  return (
    <div
      className="inline-flex rounded-none border overflow-hidden"
      style={{ borderColor: "oklch(0.58 0.24 27)" }}
    >
      {keys.map((key) => {
        const isActive = key === active;
        const d = DIVISIONS[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="px-5 py-2.5 font-display uppercase tracking-widest text-sm font-bold rounded-none transition-all duration-200"
            style={
              isActive
                ? {
                    backgroundColor: "oklch(0.58 0.24 27)",
                    color: "oklch(0.96 0 0)",
                  }
                : {
                    backgroundColor: "transparent",
                    color: "oklch(0.55 0 0)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = "oklch(0.96 0 0)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = "oklch(0.55 0 0)";
            }}
          >
            {d.labelEn}
          </button>
        );
      })}
    </div>
  );
}
