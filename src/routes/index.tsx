// src/routes/index.tsx
// หน้าแรก KSL 2027 — 5 sections: Hero → Match Center → Clubs → Sponsors → HOF
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUpcomingMatches,
  fetchRecentResults,
  fetchNews,
  fetchSponsors,
  fetchDivisions,
  fetchActiveSeasonClubs,
  getActiveSeasonId,
} from "@/lib/queries";
import { fetchStandingsFromMatches } from "@/lib/calculateStandings";
import { ClubCrest } from "@/components/site/ClubCrest";
import { HeroSection } from "@/components/home/HeroSection";
import { SponsorsSection } from "@/components/home/SponsorsSection";
import { HallOfFameSection } from "@/components/home/HallOfFameSection";
import { MiniMatch } from "@/components/home/MiniMatch";
import { ArrowRight } from "lucide-react";
import { SITE_YEAR, buildHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    buildHead(
      "หน้าแรก",
      `ติดตามตารางคะแนน ผลการแข่งขัน และข่าวสารล่าสุดของ Korat Super League ${SITE_YEAR}`,
      "/",
    ),
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
            <h3 className="font-display text-lg font-extrabold mb-3">ผลการแข่งขันล่าสุด</h3>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                ยังไม่มีข้อมูล — ฤดูกาล {SITE_YEAR} กำลังจะเปิดฉาก
              </p>
            ) : (
              <div className="space-y-2">
                {recent.map((m: any) => (
                  <Link key={m.id} to="/matches/$matchId" params={{ matchId: m.id }}>
                    <MiniMatch match={m} done />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Upcoming Fixtures */}
          <div>
            <h3 className="font-display text-lg font-extrabold mb-3">นัดหมายถัดไป</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                ยังไม่มีข้อมูล — รอตารางแข่งขันฤดูกาล {SITE_YEAR}
              </p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((m: any) => (
                  <Link key={m.id} to="/matches/$matchId" params={{ matchId: m.id }}>
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

/** กริดสโมสร 2027 + ช่องสปอนเซอร์ประจำสโมสร (รอข้อมูลสปอนเซอร์ฤดูกาลใหม่) */
function ClubGrid() {
  const { data: clubs = [] } = useQuery({
    queryKey: ["clubs-active-season"],
    queryFn: fetchActiveSeasonClubs,
  });
  const seniorClubs = clubs;

  return (
    <section aria-label="สโมสรในฤดูกาล 2027" className="bg-asphalt-deep border-y border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-7 bg-korat-red" />
              <span className="text-[10px] font-bold tracking-[0.24em] text-korat-red uppercase">
                Clubs · Season {SITE_YEAR}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-none">
              สโมสรในฤดูกาล {SITE_YEAR}
            </h2>
          </div>
          <Link
            to="/clubs"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-korat-red transition-colors"
          >
            ดูสโมสรทั้งหมด <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seniorClubs.map((c: any) => {
            const sponsorName = (c as any).sponsor_name as string | undefined;
            return (
              <Link
                key={c.id}
                to="/clubs/$slug"
                params={{ slug: c.slug }}
                className="group rounded-xl p-5 bg-card border border-border hover:border-korat-red transition-all duration-200 lift-on-hover block"
              >
                <div className="flex justify-center">
                  <ClubCrest
                    shortName={c.short_name}
                    color={c.primary_color}
                    logoUrl={c.logo_url}
                    size="lg"
                  />
                </div>
                <div className="text-center mt-3 font-display font-extrabold text-sm md:text-base leading-tight group-hover:text-korat-red transition-colors">
                  {c.name}
                </div>
                <div
                  className={`text-center mt-1.5 text-[11px] font-semibold ${
                    sponsorName ? "text-korat-gold" : "text-muted-foreground/60"
                  }`}
                >
                  {sponsorName ?? "สปอนเซอร์ · รอประกาศ"}
                </div>
              </Link>
            );
          })}
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
        [...divisions].sort((a: any, b: any) => a.tier - b.tier).find((d: any) => d.tier === 1) ??
        divisions[0]
      )?.id
    : undefined;

  const { data: standings = [] } = useQuery({
    queryKey: ["standings-from-matches", seniorDivisionId ?? "default"],
    queryFn: async () => {
      const sid = await getActiveSeasonId();
      return fetchStandingsFromMatches(seniorDivisionId!, sid!);
    },
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
      {/* ① Hero — branding 2027 + Editor's Pick (ข่าวเด่น + ข่าวล่าสุด) */}
      <HeroSection news={news} />

      {/* ② Match Center — ผลล่าสุด + นัดหมาย */}
      <MatchCenterSection />

      {/* ③ สโมสร 2027 (+ ช่องสปอนเซอร์ประจำสโมสร) */}
      <ClubGrid />

      {/* ④ สปอนเซอร์/พันธมิตร */}
      <SponsorsSection sponsors={sponsors} />

      {/* ⑤ Hall of Fame */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <HallOfFameSection />
      </div>
    </div>
  );
}
