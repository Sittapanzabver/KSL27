import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Award, HeartHandshake, ArrowRight } from "lucide-react";
import { fetchClubHistory } from "@/lib/archiveQueries";
import { fetchTopScorersTable } from "@/lib/queries";
import { SectionTitle } from "./SectionTitle";

const HOF_LINK = "/hall-of-memory";

type Category = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
};

const CATEGORIES: Category[] = [
  {
    key: "legends",
    icon: Star,
    eyebrow: "Legendary Players",
    title: "ตำนานผู้เล่น",
    description: "นักเตะที่สร้างชื่อและจารึกประวัติศาสตร์ของลีก",
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    key: "scorers",
    icon: Trophy,
    eyebrow: "Top Scorers",
    title: "ดาวซัลโวตลอดกาล",
    description: "เจ้าของรองเท้าทองคำและสถิติประตูสูงสุดในแต่ละฤดูกาล",
    accent: "from-korat-red/25 to-korat-red/0",
  },
  {
    key: "clubs",
    icon: Award,
    eyebrow: "Club Achievements",
    title: "ผลงานสโมสร",
    description: "ถ้วยรางวัล แชมป์ และความสำเร็จของแต่ละสโมสร",
    accent: "from-cyan-500/20 to-cyan-500/0",
  },
  {
    key: "community",
    icon: HeartHandshake,
    eyebrow: "Community Contributors",
    title: "ผู้สนับสนุนชุมชน",
    description: "บุคคลและองค์กรที่ขับเคลื่อนวงการฟุตบอลโคราช",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
];

export function HallOfFameSection() {
  const { data: history = [] } = useQuery({
    queryKey: ["club-history"],
    queryFn: fetchClubHistory,
  });

  const { data: scorers = [] } = useQuery({
    queryKey: ["top-scorers", "senior", "hof"],
    queryFn: () => fetchTopScorersTable("senior"),
  });

  const topScorer = (scorers as any[])[0];
  const topAchievement = history
    .flatMap((c) => c.achievements.map((a) => ({ club: c.display_name, text: a })))
    .slice(0, 1)[0];

  return (
    <section className="mt-12">
      <SectionTitle title="Hall of Fame" link={HOF_LINK} linkLabel="ดูทั้งหมด" />

      <Link
        to={HOF_LINK}
        className="group relative block overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-korat-red/15 via-asphalt-deep to-asphalt p-6 md:p-8 card-shadow hover:border-korat-red/60 transition-colors"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-korat-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300 mb-2">
              Korat Super League · Honors
            </p>
            <h3 className="font-display text-3xl md:text-4xl font-extrabold italic tracking-tight">
              HALL OF <span className="text-korat-red">FAME</span>
            </h3>
            <p className="mt-3 text-sm text-concrete/80 leading-relaxed">
              รวมตำนาน ผู้เล่น สโมสร และผู้สนับสนุน ที่ร่วมสร้างประวัติศาสตร์ลีกโคราชตลอดทุกฤดูกาล
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-concrete/70">
            {topScorer && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-korat-red/15 px-3 py-1 text-korat-red">
                <Trophy className="size-3" /> {topScorer.name} · {topScorer.goals} ประตู
              </span>
            )}
            {topAchievement && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-amber-300">
                <Award className="size-3" /> {topAchievement.club}
              </span>
            )}
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.key}
                className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b ${c.accent} p-4 hover:border-korat-red/50 transition-colors`}
              >
                <div className="absolute inset-0 bg-asphalt-deep/40" />
                <div className="relative">
                  <div className="size-9 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                    <Icon className="size-4 text-white" />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-concrete/60">
                    {c.eyebrow}
                  </p>
                  <h4 className="font-display text-base md:text-lg font-extrabold leading-tight mt-0.5">
                    {c.title}
                  </h4>
                  <p className="hidden md:block mt-2 text-[11px] text-concrete/70 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-korat-red group-hover:gap-3 transition-all">
          เข้าสู่ Hall of Fame <ArrowRight className="size-3.5" />
        </div>
      </Link>
    </section>
  );
}
