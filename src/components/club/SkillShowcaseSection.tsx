/**
 * SkillShowcaseSection — แสดงทักษะ/จุดแข็งของสโมสร
 * ใช้ใน clubs.$slug.tsx
 */
import { CLUB_SKILLS, CLUB_RADAR_DATA, type ClubRadarData } from "@/data/clubSkills";

interface SkillShowcaseProps {
  slug: string;
  clubName: string;
  primaryColor?: string | null;
}

/** Radar chart dimensions */
const RADAR_DIMS = [
  { key: "possession", label: "ครองบอล" },
  { key: "pressing", label: "Pressing" },
  { key: "counterAttack", label: "สวนกลับ" },
  { key: "setPieces", label: "ลูกตั้งเตะ" },
  { key: "defense", label: "เกมรับ" },
  { key: "creativity", label: "สร้างสรรค์" },
] as const;

/** Simple radar chart using SVG */
function RadarChart({ data, color }: { data: ClubRadarData; color: string }) {
  const cx = 150;
  const cy = 150;
  const maxR = 120;
  const levels = 5;
  const angleStep = (2 * Math.PI) / RADAR_DIMS.length;

  // Calculate polygon points
  const dataPoints = RADAR_DIMS.map((dim, i) => {
    const val = data[dim.key] / 100;
    const angle = i * angleStep - Math.PI / 2;
    const r = val * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
      {/* Grid levels */}
      {Array.from({ length: levels }).map((_, level) => {
        const r = ((level + 1) / levels) * maxR;
        const points = RADAR_DIMS.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={level === levels - 1 ? 1.5 : 0.5}
            opacity={0.4}
          />
        );
      })}

      {/* Axis lines */}
      {RADAR_DIMS.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos(angle)}
            y2={cy + maxR * Math.sin(angle)}
            stroke="currentColor"
            className="text-border"
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      {/* Data polygon */}
      <path d={dataPath} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={2} />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="white" strokeWidth={1.5} />
      ))}

      {/* Labels */}
      {RADAR_DIMS.map((dim, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelR = maxR + 28;
        const x = cx + labelR * Math.cos(angle);
        const y = cy + labelR * Math.sin(angle);
        return (
          <text
            key={dim.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground text-[10px] font-bold uppercase tracking-wider"
          >
            {dim.label}
          </text>
        );
      })}
    </svg>
  );
}

/** Skill strength item */
function SkillItem({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-1 flex items-center justify-center size-5 text-[10px] font-black leading-none flex-shrink-0 text-white rounded-sm"
        style={{ backgroundColor: color }}
      >
        ✓
      </span>
      <span className="text-sm text-foreground leading-snug">{text}</span>
    </div>
  );
}

export function SkillShowcaseSection({ slug, clubName, primaryColor }: SkillShowcaseProps) {
  const skill = CLUB_SKILLS[slug];
  const radar = CLUB_RADAR_DATA[slug];
  const color = primaryColor || skill?.accentColor || "#cc0000";

  if (!skill) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px w-7 bg-korat-red" />
        <span className="text-[10px] font-bold tracking-[0.24em] text-korat-red uppercase">
          Skills & Strengths
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Skills info */}
        <div className="space-y-6">
          {/* Play style */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              สไตล์การเล่น
            </p>
            <p className="font-display text-2xl font-extrabold" style={{ color }}>
              {skill.style}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{skill.tactics}</p>
          </div>

          {/* Strengths */}
          <div className="bg-card border border-border p-5 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              จุดแข็ง
            </p>
            <div className="space-y-3">
              {skill.strengths.map((s) => (
                <SkillItem key={s} text={s} color={color} />
              ))}
            </div>
          </div>

          {/* Weaknesses (if any) */}
          {skill.weaknesses && skill.weaknesses.length > 0 && (
            <div className="bg-card border border-border p-5 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                จุดที่ต้องพัฒนา
              </p>
              <div className="space-y-3">
                {skill.weaknesses.map((w) => (
                  <div key={w} className="flex items-start gap-3">
                    <span className="mt-1 flex items-center justify-center size-5 text-[10px] font-black leading-none flex-shrink-0 text-white bg-muted-foreground rounded-sm">
                      —
                    </span>
                    <span className="text-sm text-muted-foreground leading-snug">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Radar chart */}
        {radar && (
          <div className="bg-card border border-border p-5 rounded-xl flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 self-start">
              สถิติเปรียบเทียบ
            </p>
            <RadarChart data={radar} color={color} />
            <p className="text-[10px] text-muted-foreground mt-4 text-center">
              คะแนน 0-100 · เปรียบเทียบจุดแข็งแต่ละด้าน
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
