// src/routes/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUpcomingMatches,
  fetchRecentResults,
  fetchNews,
  fetchSponsors,
  fetchDivisions,
} from "@/lib/queries";
import { fetchStandingsFromMatches } from "@/lib/calculateStandings";
import { fetchClubs } from "@/lib/queries";
import { DIVISIONS } from "@/lib/divisions";
import { SeasonArchive } from "@/components/site/SeasonArchive";
import { HeroSection } from "@/components/home/HeroSection";
import { DistrictCoverageSection } from "@/components/home/DistrictCoverageSection";
import { U16SpotlightSection } from "@/components/home/U16SpotlightSection";
import { StandingsSection } from "@/components/home/StandingsSection";
import { TopScorersSection } from "@/components/home/TopScorersSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { HallOfFameSection } from "@/components/home/HallOfFameSection";
import { MiniMatch } from "@/components/home/MiniMatch";
import { ArrowRight } from "lucide-react";
import { SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: `หน้าแรก — Korat Super League ${SITE_YEAR}` },
      {
        name: "description",
        content:
          `ติดตามตารางคะแนน ผลการแข่งขัน และข่าวสารล่าสุดของ Meinhard Sports Korat Super League ${SITE_YEAR}`,
      },
    ],
  }),
});

function MatchCenterSection() {
  const { data: recent = [] } = useQuery({
    queryKey: ["recent-results", 3],
    queryFn: () => fetchRecentResults(3),
  });
  const { data: upcoming = [] } = useQuery({
    queryKey: ["upcoming", 3],
    queryFn: () => fetchUpcomingMatches(3),
  });

  return (
    <section className="bg-asphalt-deep border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-7 bg-korat-red" />
          <span className="text-[10px] font-bold tracking-[0.24em] text-korat-red uppercase">
            Match Center
          </span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Latest Results */}
          <div>
            <h3 className="font-display text-lg font-extrabold mb-3">
              ผลการแข่งขันล่าสุด
            </h3>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-2">
                {recent.map((m: any) => (
                  <Link
                    key={m.id}
                    to="/matches/$matchId"
                    params={{ matchId: m.id }}
                  >
                    <MiniMatch match={m} done />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Upcoming Fixtures */}
          <div>
            <h3 className="font-display text-lg font-extrabold mb-3">
              นัดหมายถัดไป
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((m: any) => (
                  <Link
                    key={m.id}
                    to="/matches/$matchId"
                    params={{ matchId: m.id }}
                  >
                    <MiniMatch match={m} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { data: divisions } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
  });

  const seniorDivisionId = divisions
    ? (
        [...divisions].sort((a: any, b: any) => a.tier - b.tier).find(
          (d: any) => d.tier === 1
        ) ?? divisions[0]
      )?.id
    : undefined;

  const { data: standings = [] } = useQuery({
    queryKey: ["standings-from-matches", seniorDivisionId ?? "default"],
    queryFn: () => fetchStandingsFromMatches(seniorDivisionId!),
    enabled: !!seniorDivisionId,
  });

  const { data: news = [] } = useQuery({
    queryKey: ["news", 6],
    queryFn: () => fetchNews(6),
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ["sponsors"],
    queryFn: fetchSponsors,
  });

  return (
    <div>
      {/* ① Hero — news ticker + featured match */}
      <HeroSection news={news} />

      {/* ② District Coverage — 8 อำเภอ map/stats */}
      <DistrictCoverageSection standings={standings} />

      {/* ③ U-16 Academy Spotlight — CSR / investor angle ← ใหม่ */}
      <U16SpotlightSection />

      {/* ④ Match Center — ผลล่าสุด + นัดหมาย */}
      <MatchCenterSection />

      {/* ⑤ Sticky section nav */}
      <nav className="bg-asphalt-deep border-b border-border sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { to: "/standings", label: "ตารางคะแนน" },
              { to: "/matches", label: "ผลการแข่งขัน" },
              { to: "/players", label: "สถิติ & นักเตะ" },
              { to: "/top-scorers", label: "ดาวซัลโว" },
              { to: "/news", label: "ข่าวสาร" },
            ].map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className="shrink-0 px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-display font-bold uppercase tracking-wide text-muted-foreground hover:text-white border-b-2 border-transparent hover:border-korat-red/60 transition-colors whitespace-nowrap"
                activeProps={{
                  className: "text-white !border-korat-red bg-korat-red/10",
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* ⑥ Standings + Top Scorers */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid gap-6 lg:[grid-template-columns:1.35fr_1fr]">
          <StandingsSection standings={standings} />
          <TopScorersSection />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/clubs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-korat-red/40 bg-korat-red/10 hover:bg-korat-red hover:text-white text-korat-red text-xs font-extrabold uppercase tracking-widest transition-colors"
          >
            สำรวจสโมสรทั้งหมด <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* U-16 Youth League Banner */}
      <U16YouthBanner />

      {/* Club Sponsor Grid */}
      <ClubSponsorGrid />

      {/* ⑦ Sponsors */}
      <SponsorsSection sponsors={sponsors} />


      {/* ⑧ News */}
      <NewsSection news={news} />

      {/* ⑨ Hall of Fame */}
      <HallOfFameSection />

      {/* ⑩ Season Archive */}
      <SeasonArchive />
    </div>
  );
}

function U16YouthBanner() {
  return (
    <section
      aria-label="KSL U-16 Youth League"
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        background:
          "linear-gradient(135deg, #0a0a2e 0%, #1a1a6e 55%, #cc0000 100%)",
      }}
    >
      {/* Diagonal stripe overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(45deg, #ffffff 0 2px, transparent 2px 16px)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
        <span className="inline-block animate-pulse bg-white/15 border border-white/30 text-white text-[10px] font-black tracking-[0.3em] uppercase px-3 py-1 mb-5">
          U-16
        </span>
        <h2
          className="text-white font-black uppercase leading-none"
          style={{
            fontSize: "2.5rem",
            letterSpacing: "0.15em",
            fontWeight: 900,
          }}
        >
          KSL U-16 YOUTH LEAGUE ${SITE_YEAR}
        </h2>
        <p
          className="mt-4"
          style={{ color: "#ffd700", fontSize: "1rem" }}
        >
          พัฒนาเยาวชน สู่อนาคตฟุตบอลโคราช
        </p>
        <Link
          to="/standings"
          search={{ division: "U16" } as any}
          className="inline-flex items-center mt-8 rounded-full px-6 py-3 font-bold text-white transition-colors"
          style={{ backgroundColor: "#cc0000" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "#ff1a1a")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.backgroundColor = "#cc0000")
          }
        >
          ดูตารางคะแนน U-16 →
        </Link>
      </div>
    </section>
  );
}

function ClubSponsorGrid() {
  const { data: clubs = [] } = useQuery({
    queryKey: ["clubs-all"],
    queryFn: fetchClubs,
  });
  const seniorClubs = clubs.filter(
    (c: any) => c.division_id === DIVISIONS.SUPER_LEAGUE.id,
  );

  return (
    <section
      aria-label="สปอนเซอร์ประจำสโมสร"
      className="py-12"
      style={{ backgroundColor: "#0d1f2d" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-white font-extrabold text-center text-2xl md:text-3xl mb-8">
          สปอนเซอร์ประจำสโมสร
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seniorClubs.map((c: any) => {
            const sponsorName = (c as any).sponsor_name as string | undefined;
            return (
              <Link
                key={c.id}
                to="/clubs/$slug"
                params={{ slug: c.slug }}
                className="rounded-xl p-4 border border-white/10 hover:border-[#cc0000] transition-all duration-200 block"
                style={{ backgroundColor: "#0f2a3f" }}
              >
                {c.logo_url ? (
                  <img
                    src={c.logo_url}
                    alt={`${c.name} logo`}
                    loading="lazy"
                    className="w-16 h-16 object-contain mx-auto"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto" />
                )}
                <div
                  className="text-white text-center mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  {c.name}
                </div>
                <div
                  className="text-center mt-1"
                  style={{
                    fontSize: "0.75rem",
                    color: sponsorName ? "#ffd700" : "#6b7280",
                  }}
                >
                  {sponsorName ?? "— รอข้อมูล —"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

