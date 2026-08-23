import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchMatchById,
  fetchMatchEvents,
  fetchMatchPhotos,
  fetchSponsors,
} from "@/lib/queries";
import {
  fetchSheetScorers,
  type SheetMatchScorers,
} from "@/lib/sheetScorers.functions";
import { ClubCrest } from "@/components/site/ClubCrest";
import { DIVISIONS } from "@/lib/divisions";
import { Award, Share2, ArrowLeft } from "lucide-react";
import { SITE_YEAR, buildHead } from "@/lib/site";

export const Route = createFileRoute("/matches/$matchId")({
  // โหลดข้อมูลแมตช์ฝั่ง server → head (og:*) ส่งออกใน HTML เพื่อให้ Facebook/LINE
  // แสดง preview ถูกต้องตอนแชร์ลิงก์ (pattern เดียวกับ news.$slug.tsx)
  loader: async ({ params }) => {
    try {
      return await fetchMatchById(params.matchId);
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) => {
    const m = loaderData as any;
    const hasTeams = Boolean(m?.home?.name && m?.away?.name);
    const title = hasTeams
      ? `${m.home.short_name} ${m.home_score ?? 0}-${m.away_score ?? 0} ${m.away.short_name}`
      : `แมตช์ ${params.matchId}`;
    const desc = hasTeams
      ? m.status === "completed"
        ? `ผลการแข่งขัน ${m.home.name} ${m.home_score ?? 0}-${m.away_score ?? 0} ${m.away.name} · แมตช์เดย์ ${m.matchweek} · ${m.venue ?? "สนามแข่งขัน"}`
        : `โปรแกรมแข่งขัน ${m.home.name} พบ ${m.away.name} · แมตช์เดย์ ${m.matchweek} · ${m.venue ?? "สนามแข่งขัน"}`
      : "ผลการแข่งขันแบบสด สถิติ ผู้ทำประตู MVP และคลังภาพ";
    return buildHead(title, desc, `/matches/${params.matchId}`);
  },
  component: MatchCenter,
});

function normalize(s?: string) {
  return (s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function formatLocalDate(dateInput?: string) {
  if (!dateInput) return "";

  const d = new Date(dateInput);

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function MatchCenter() {
  const { matchId } = Route.useParams();

  const [m, setM] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState("");
  const [sheetRows, setSheetRows] = useState<SheetMatchScorers[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [
          matchData,
          eventsData,
          photosData,
          sponsorsData,
        ] = await Promise.all([
          fetchMatchById(matchId),
          fetchMatchEvents(matchId),
          fetchMatchPhotos(matchId),
          fetchSponsors(),
        ]);

        const isU16 = matchData?.division_id === DIVISIONS.U16.id;
        const sheetData = await fetchSheetScorers({ data: isU16 });

        console.log("MATCH:", matchData);
        console.log("EVENTS:", eventsData);
        console.log("SHEET:", sheetData);

        setM(matchData);
        setEvents(eventsData ?? []);
        setPhotos(photosData ?? []);
        setSponsors(sponsorsData ?? []);
        setSheetRows(sheetData ?? []);
      } catch (e) {
        console.error("MatchCenter load error:", e);
      }
    }

    load();

    setShareUrl(
      typeof window !== "undefined" ? window.location.href : ""
    );
  }, [matchId]);

  if (!m || !m.home || !m.away) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-muted-foreground">
      กำลังโหลดข้อมูลแมตช์...
    </div>
  );
}

  const finished = m.status === "completed";
  const live = m.status === "live";

  const date = new Date(m.kickoff_at);

  const homeGoals = events.filter(
    (e) =>
      e.club?.short_name === m.home.short_name &&
      (e.event_type === "goal" ||
        e.event_type === "penalty" ||
        e.event_type === "own_goal")
  );

  const awayGoals = events.filter(
    (e) =>
      e.club?.short_name === m.away.short_name &&
      (e.event_type === "goal" ||
        e.event_type === "penalty" ||
        e.event_type === "own_goal")
  );

  const cards = events.filter(
    (e) =>
      e.event_type === "yellow_card" ||
      e.event_type === "red_card"
  );

  const matchDateStr = formatLocalDate(m.kickoff_at);

  console.log("MATCH DATE:", matchDateStr);

  const sheetMatch =
    sheetRows.find(
      (r) =>
        normalize(r.home_team) ===
          normalize(m.home.name) &&
        normalize(r.away_team) ===
          normalize(m.away.name) &&
        normalize(r.date) === normalize(matchDateStr)
    ) ??
    sheetRows.find(
      (r) =>
        normalize(r.home_team) ===
          normalize(m.home.name) &&
        normalize(r.away_team) ===
          normalize(m.away.name) &&
        Number(r.matchweek) === Number(m.matchweek)
    );

  console.log("MATCH FOUND:", sheetMatch);

  const sheetHome = sheetMatch?.home ?? [];
  const sheetAway = sheetMatch?.away ?? [];

  const showSheetHome =
    homeGoals.length === 0 && sheetHome.length > 0;

  const showSheetAway =
    awayGoals.length === 0 && sheetAway.length > 0;

  const titleSponsor =
    sponsors.find((s) => s.tier === "title") ??
    sponsors[0];

  const shareText = `${m.home.name} ${m.home_score ?? ""}-${m.away_score ?? ""} ${m.away.name} | Korat Super League ${SITE_YEAR}`;

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  const lineShare = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative bg-asphalt border-b-2 border-korat-red/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--korat-red)_0%,_transparent_60%)] opacity-20" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Link
            to="/matches"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-3" />
            กลับโปรแกรม
          </Link>

          <div className="flex items-center gap-3 mb-6 text-xs">
            <span className="bg-korat-red text-white px-2 py-1 font-bold uppercase">
              MD {m.matchweek}
            </span>

            {live && (
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 px-2 py-1 font-bold uppercase">
                <span className="size-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE
              </span>
            )}

            {finished && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 font-bold uppercase">
                FT
              </span>
            )}

            {!finished && !live && (
              <span className="text-muted-foreground uppercase tracking-wider">
                {date.toLocaleString("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            {/* HOME */}
            <div className="text-center">
              <Link
                to="/clubs/$slug"
                params={{ slug: m.home?.slug}}
              >
                <ClubCrest
                  shortName={m.home.short_name}
                  color={m.home.primary_color}
                  logoUrl={m.home.logo_url}
                  size="xl"
                />

                <div className="mt-3 font-display text-base md:text-2xl font-extrabold tracking-tight">
                  {m.home.name}
                </div>

                <div className="text-xs text-muted-foreground">
                  เจ้าบ้าน
                </div>
              </Link>
            </div>

            {/* SCORE */}
            <div className="text-center">
              {finished || live ? (
                <div className="font-display text-5xl md:text-7xl font-extrabold tabular-nums tracking-tighter">
                  {m.home_score ?? 0}
                  <span className="text-korat-red mx-2">
                    -
                  </span>
                  {m.away_score ?? 0}
                </div>
              ) : (
                <div className="font-display text-4xl md:text-6xl font-extrabold text-korat-red">
                  VS
                </div>
              )}

              <div className="mt-2 text-xs text-muted-foreground uppercase tracking-widest">
                {m.venue ?? "TBD"}
              </div>

              {m.referee && (
                <div className="text-[10px] text-muted-foreground">
                  กรรมการ: {m.referee}
                </div>
              )}
            </div>

            {/* AWAY */}
            <div className="text-center">
              <Link
                to="/clubs/$slug"
                params={{ slug: m.away?.slug }}
              >
                <ClubCrest
                  shortName={m.away.short_name}
                  color={m.away.primary_color}
                  logoUrl={m.away.logo_url}
                  size="xl"
                />

                <div className="mt-3 font-display text-base md:text-2xl font-extrabold tracking-tight">
                  {m.away.name}
                </div>

                <div className="text-xs text-muted-foreground">
                  ทีมเยือน
                </div>
              </Link>
            </div>
          </div>

          {/* GOAL SCORERS */}
          {(finished ||
            live ||
            showSheetHome ||
            showSheetAway) && (
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-3xl mx-auto text-xs">
              <div className="text-right space-y-1">
                {showSheetHome
                  ? sheetHome.map((g, i) => (
                      <div key={`sh-${i}`}>
                        ⚽ {g.name}
                        {g.ownGoal ? " (OG)" : ""}
                        {g.minute !== null && (
                          <span className="text-muted-foreground">
                            {" "}
                            {g.minute}'
                          </span>
                        )}
                      </div>
                    ))
                  : homeGoals.map((g) => (
                      <div key={g.id}>
                        ⚽ {g.player?.name ?? "-"}
                        <span className="text-muted-foreground">
                          {" "}
                          {g.minute}'
                        </span>
                      </div>
                    ))}
              </div>

              <div className="text-left space-y-1">
                {showSheetAway
                  ? sheetAway.map((g, i) => (
                      <div key={`sa-${i}`}>
                        ⚽ {g.name}
                        {g.ownGoal ? " (OG)" : ""}
                        {g.minute !== null && (
                          <span className="text-muted-foreground">
                            {" "}
                            {g.minute}'
                          </span>
                        )}
                      </div>
                    ))
                  : awayGoals.map((g) => (
                      <div key={g.id}>
                        ⚽ {g.player?.name ?? "-"}
                        <span className="text-muted-foreground">
                          {" "}
                          {g.minute}'
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* SHARE */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Share2 className="size-3" />
            แชร์
          </span>

          <a
            href={fbShare}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1877F2] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
          >
            Facebook
          </a>

          <a
            href={lineShare}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#06C755] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90"
          >
            LINE
          </a>
        </div>

        {/* MVP */}
        {m.mvp && (
          <div className="bg-gradient-to-r from-korat-red/20 to-transparent border-l-4 border-korat-red p-4 flex items-center gap-3">
            <Award className="size-8 text-korat-red shrink-0" />

            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-korat-red font-bold">
                Player of the Match
              </div>

              <div className="font-display text-xl font-extrabold">
                {m.mvp.name}
              </div>

              {m.mvp.position && (
                <div className="text-xs text-muted-foreground">
                  {m.mvp.position} · #
                  {m.mvp.jersey_number}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MATCH STATS */}
        <div className="bg-card border border-border p-5">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-tight mb-4">
            สถิติแมตช์
          </h3>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <Stat
              l="ประตู"
              h={m.home_score ?? 0}
              a={m.away_score ?? 0}
            />

            <Stat
              l="ใบเหลือง"
              h={
                cards.filter(
                  (c) =>
                    c.event_type === "yellow_card" &&
                    c.club?.short_name ===
                      m.home.short_name
                ).length
              }
              a={
                cards.filter(
                  (c) =>
                    c.event_type === "yellow_card" &&
                    c.club?.short_name ===
                      m.away.short_name
                ).length
              }
            />

            <Stat
              l="ใบแดง"
              h={
                cards.filter(
                  (c) =>
                    c.event_type === "red_card" &&
                    c.club?.short_name ===
                      m.home.short_name
                ).length
              }
              a={
                cards.filter(
                  (c) =>
                    c.event_type === "red_card" &&
                    c.club?.short_name ===
                      m.away.short_name
                ).length
              }
            />
          </div>

          {m.attendance && (
            <div className="mt-4 text-xs text-muted-foreground">
              ผู้ชม{" "}
              {m.attendance.toLocaleString("th-TH")} คน
            </div>
          )}
        </div>

        {/* TIMELINE */}
        {events.length > 0 && (
          <div className="bg-card border border-border p-5">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight mb-4">
              ไทม์ไลน์
            </h3>

            <div className="space-y-2">
              {events
                .sort(
                  (a, b) =>
                    (a.minute ?? 0) -
                    (b.minute ?? 0)
                )
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 text-sm border-b border-border/50 pb-2"
                  >
                    <span className="font-bold tabular-nums w-10 text-korat-red">
                      {e.minute}'
                    </span>

                    <span className="text-xs uppercase tracking-wide text-muted-foreground w-24">
                      {labelOf(e.event_type)}
                    </span>

                    <span className="font-bold flex-1">
                      {e.player?.name ?? "-"}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {e.club?.short_name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {photos.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight mb-3">
              คลังภาพ
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {photos.map((p) => (
                <a
                  key={p.id}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden bg-card"
                >
                  <img
                    src={p.url}
                    alt={p.caption ?? ""}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* SPONSOR */}
        {titleSponsor && (
          <div className="bg-card border border-border p-6 text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Match Presented By
            </div>

            {titleSponsor.logo_url ? (
              <img
                src={titleSponsor.logo_url}
                alt={titleSponsor.name}
                className="h-12 mx-auto object-contain"
              />
            ) : (
              <div className="font-display text-2xl font-extrabold">
                {titleSponsor.name}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  l,
  h,
  a,
}: {
  l: string;
  h: number;
  a: number;
}) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        {l}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-display text-2xl font-extrabold tabular-nums w-10 text-right">
          {h}
        </span>

        <div className="flex-1 h-1.5 bg-background overflow-hidden flex">
          <div
            className="bg-korat-red"
            style={{
              width: `${
                (h / ((h + a) || 1)) * 100
              }%`,
            }}
          />
        </div>

        <span className="font-display text-2xl font-extrabold tabular-nums w-10 text-left">
          {a}
        </span>
      </div>
    </div>
  );
}

function labelOf(t: string) {
  return (
    {
      goal: "⚽ ประตู",
      penalty: "🅿️ จุดโทษ",
      assist: "🅰️ แอสซิสต์",
      yellow_card: "🟨 ใบเหลือง",
      red_card: "🟥 ใบแดง",
      own_goal: "⚽ OG",
      substitution: "🔄 เปลี่ยนตัว",
    }[t] ?? t
  );
}
