import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  fetchAllMatches,
  fetchClubBySlug,
  fetchDivisions,
  fetchMatchEvents,
  fetchPlayersByClub,
} from "@/lib/queries";
import { fetchStandingsFromMatches } from "@/lib/calculateStandings";
import { ClubCrest } from "@/components/site/ClubCrest";
import { SITE_YEAR, buildHead } from "@/lib/site";

export const Route = createFileRoute("/clubs/$slug")({
  component: ClubDetail,
  head: ({ params }) =>
    buildHead(
      `${params.slug}`,
      `สโมสร ${params.slug} — Korat Super League ${SITE_YEAR}`,
      `/clubs/${params.slug}`,
    ),
});

type DivCategory = "senior" | "u16";

// ─── Club sponsor config ───────────────────────────────────────────────────
const CLUB_SPONSORS: Record<string, { name: string; logo: string; url: string; tier: string }[]> = {
  "khonburi-fc": [
    {
      name: "Mayor Ka Care Co., Ltd.",
      logo: "/logo-mayor-ka-care.png",
      url: "https://www.facebook.com/mayorkare",
      tier: "ผู้สนับสนุนหลัก",
    },
  ],
};

const DISTRICT_ATTRACTIONS: Record<string, { name: string; desc: string; img: string }[]> = {
  "ครบุรี": [
    { name: "สะพานไม้ 100 ปี", desc: "สะพานไม้อายุกว่า 100 ปี ทอดยาวเกือบ 1 กม. ผ่านทุ่งนาสีเขียว จุดชมพระอาทิตย์ตกดินที่สวยงาม", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80" },
    { name: "เขื่อนลำแชะ", desc: "เขื่อนในผืนป่าดงพญาเย็น-เขาใหญ่ ทะเลสาบขนาดใหญ่กว่า 275 ล้าน ลบ.ม. บรรยากาศธรรมชาติร่มรื่น", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
    { name: "ป่าดงพญาเย็น-เขาใหญ่", desc: "มรดกโลกทางธรรมชาติ UNESCO ป่าฝนเขตร้อนที่อุดมสมบูรณ์ที่สุดแห่งหนึ่งในเอเชียตะวันออกเฉียงใต้", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
  ],
  "พิมาย": [
    { name: "อุทยานประวัติศาสตร์พิมาย", desc: "ปราสาทขอมโบราณที่ยิ่งใหญ่ที่สุดในไทย มรดกประวัติศาสตร์คู่เมืองพิมายมากกว่า 1,000 ปี", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80" },
    { name: "พิพิธภัณฑสถานแห่งชาติพิมาย", desc: "รวบรวมโบราณวัตถุสมัยขอมและทวารวดีชิ้นสำคัญ ศึกษาประวัติศาสตร์อีสานใต้ได้ในที่เดียว", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80" },
    { name: "อุทยานไทรงาม", desc: "ต้นไทรขนาดยักษ์อายุนับร้อยปี รากระเกะระกะงดงาม เป็นสัญลักษณ์ธรรมชาติประจำพิมาย", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
  ],
  "ปักธงชัย": [
    { name: "ศูนย์หัตถกรรมผ้าไหมปักธงชัย", desc: "แหล่งผ้าไหมมือทอชื่อดังระดับประเทศ ชมกระบวนการทอผ้าและเลือกซื้อผ้าไหมคุณภาพ", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
    { name: "วนอุทยานปักธงชัย", desc: "ป่าธรรมชาติร่มรื่นใกล้ตัวเมือง เหมาะสำหรับเดินป่าและพักผ่อนหย่อนใจท่ามกลางธรรมชาติ", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
    { name: "ตลาดย้อนยุคปักธงชัย", desc: "ตลาดชุมชนบรรยากาศวินเทจ อาหารพื้นเมืองและของฝากหลากหลาย วิถีชีวิตชุมชนโคราชแท้ๆ", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  ],
  "เสิงสาง": [
    { name: "อุทยานแห่งชาติทับลาน", desc: "ผืนป่ามรดกโลก UNESCO ติดกับเขาใหญ่ ธรรมชาติบริสุทธิ์ น้ำตกและสัตว์ป่าหลากหลายชนิด", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80" },
    { name: "น้ำตกเสิงสาง", desc: "น้ำตกธรรมชาติในป่าเขตอุทยานทับลาน อากาศเย็นสบาย เหมาะเที่ยวช่วงหน้าฝนและต้นหนาว", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80" },
    { name: "หมู่บ้านชาวกูย", desc: "ชุมชนชาติพันธุ์กูย (ส่วย) วัฒนธรรมเลี้ยงช้างและวิถีชีวิตดั้งเดิมที่หาชมได้ยาก", img: "https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=600&q=80" },
  ],
  "โนนแดง": [
    { name: "วัดโนนแดง", desc: "วัดเก่าแก่ประจำชุมชน ศิลปะอีสานงดงาม เป็นศูนย์รวมจิตใจของชาวโนนแดงมาช้านาน", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80" },
    { name: "ทุ่งนาโนนแดง", desc: "ทุ่งนาเขียวขจีกว้างใหญ่ บรรยากาศชนบทอีสานแท้ๆ สวยงามโดยเฉพาะช่วงหน้าทำนาปี", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80" },
    { name: "หนองน้ำชุมชน", desc: "แหล่งน้ำธรรมชาติของชุมชน จุดพักผ่อนยามเย็น มีวิวทิวทัศน์สงบงาม", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
  ],
  "ขามสะแกแสง": [
    { name: "ปราสาทเมืองแขก", desc: "โบราณสถานขอมยุคก่อนพิมาย หินทรายแดงสลักลวดลายละเอียด หนึ่งใน unseen โคราชที่ยังไม่ดังมาก", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80" },
    { name: "หนองระเวียง", desc: "บึงน้ำขนาดใหญ่ แหล่งนกน้ำธรรมชาติ บรรยากาศสงบเงียบ เหมาะสำหรับชมพระอาทิตย์ขึ้นยามเช้า", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80" },
    { name: "ตลาดชุมชนขามสะแกแสง", desc: "ตลาดเช้าชุมชน อาหารพื้นบ้านอีสานสดใหม่ ข้าวต้มมัด หมูปิ้ง ของฝากราคาย่อมเยา", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
  ],
  "เมืองนครราชสีมา": [
    { name: "อนุสาวรีย์ท้าวสุรนารี", desc: "สัญลักษณ์แห่งความกล้าหาญประจำโคราช วีรสตรีผู้กอบกู้เมืองในยุค ร.3 ศูนย์รวมใจชาวโคราช", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80" },
    { name: "ตลาดย่าโม", desc: "ตลาดกลางคืนใจเมืองโคราช บรรยากาศคึกคัก อาหารอร่อยและสินค้าท้องถิ่นหลากหลายในราคาเป็นกันเอง", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80" },
    { name: "ประตูชุมพล", desc: "ประตูเมืองโบราณอายุกว่า 300 ปี สัญลักษณ์ทางประวัติศาสตร์ที่เหลือรอดของกำแพงเมืองโคราช", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80" },
  ],
};

function ClubDetail() {
  const { slug } = Route.useParams();
  const [club, setClub] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [divisions, setDivisions] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [seniorDivisionId, setSeniorDivisionId] = useState<string | null>(null);
  const [eventsByMatch, setEventsByMatch] = useState<Record<string, any[]>>({});
  const [matchTab, setMatchTab] = useState<DivCategory>("senior");
  const [squadCategory, setSquadCategory] = useState<DivCategory>("senior");

  const seniorPlayers = useMemo(
    () => players.filter((p) => (p.category ?? "senior") === "senior"),
    [players]
  );
  const u16Players = useMemo(
    () => players.filter((p) => p.category === "u16"),
    [players]
  );
  const filteredSquad = squadCategory === "u16" ? u16Players : seniorPlayers;

  const clubSponsors = CLUB_SPONSORS[slug] ?? [];

  useEffect(() => {
    let active = true;

    (async () => {
      const c = await fetchClubBySlug(slug);
      if (!active) return;

      if (!c) {
        setClub(null);
        return;
      }

      setClub(c);

      const [pls, all, divs] = await Promise.all([
        fetchPlayersByClub(c.id),
        fetchAllMatches(),
        fetchDivisions(),
      ]);

      if (!active) return;

      setPlayers(pls);
      setDivisions(divs);
      setMatches(all.filter((m: any) => m.home.id === c.id || m.away.id === c.id));

      const senior =
        [...divs].sort((a, b) => a.tier - b.tier).find((d) => d.tier === 1) ?? divs[0];
      if (senior) {
        setSeniorDivisionId(senior.id);
        try {
          const st = await fetchStandingsFromMatches(senior.id);
          if (active) setStandings(st);
        } catch {
          /* graceful */
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;

    (async () => {
      const finishedMatches = matches.filter((m) => isFinished(m));

      const entries = await Promise.all(
        finishedMatches.map(async (m) => {
          try {
            const events = await fetchMatchEvents(m.id);
            return [m.id, events] as const;
          } catch {
            return [m.id, []] as const;
          }
        })
      );

      if (!active) return;

      setEventsByMatch(Object.fromEntries(entries));
    })();

    return () => {
      active = false;
    };
  }, [matches]);

  const divCategoryById = useMemo(() => {
    const map = new Map<string, DivCategory>();
    for (const d of divisions) {
      const isU16 = d.name === "U-16";
      map.set(d.id, isU16 ? "u16" : "senior");
    }
    return map;
  }, [divisions]);

  const categorize = (m: any): DivCategory => {
    if (!m.division_id) return "senior";
    return divCategoryById.get(m.division_id) ?? "senior";
  };

  const filteredMatches = useMemo(
    () => matches.filter((m) => categorize(m) === matchTab),
    [matches, matchTab, divCategoryById]
  );

  const hasU16 = useMemo(
    () => matches.some((m) => categorize(m) === "u16"),
    [matches, divCategoryById]
  );

  // ── Standings position + season stats (senior only) ──────────────────
  const standingRow = useMemo(
    () => (club ? standings.find((s) => s.club_id === club.id) : null),
    [standings, club]
  );
  const leaguePosition = useMemo(() => {
    if (!club || !standings.length) return null;
    const idx = standings.findIndex((s) => s.club_id === club.id);
    return idx >= 0 ? idx + 1 : null;
  }, [standings, club]);

  // ── Recent results (last 5 completed senior matches) ─────────────────
  const recentResults = useMemo(() => {
    return matches
      .filter((m) => categorize(m) === "senior" && isFinished(m))
      .sort(
        (a, b) =>
          new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime()
      )
      .slice(0, 5);
  }, [matches, divCategoryById]);

  // Form (W/D/L) — chronological oldest→newest of last 5
  const form = useMemo(() => {
    if (!club) return [];
    return [...recentResults].reverse().map((m) => {
      const isHome = m.home.id === club.id;
      const my = isHome ? m.home_score : m.away_score;
      const opp = isHome ? m.away_score : m.home_score;
      if (my === opp) return "D";
      return my > opp ? "W" : "L";
    });
  }, [recentResults, club]);

  if (!club) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-muted-foreground">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative border-b-4 border-korat-red overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top left, ${club.primary_color}40, transparent 60%), linear-gradient(135deg, ${club.primary_color}1a, transparent), var(--asphalt)`,
        }}
      >
        {/* Decorative monogram */}
        <div
          className="absolute -right-10 -bottom-20 font-display font-extrabold text-[18rem] leading-none opacity-[0.04] select-none pointer-events-none hidden md:block"
          style={{ color: club.primary_color ?? "#E10600" }}
        >
          {club.short_name}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <Link
            to="/clubs"
            className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-korat-red mb-6"
          >
            ← กลับไปยังสโมสรทั้งหมด
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
            <ClubCrest
              shortName={club.short_name}
              color={club.primary_color}
              logoUrl={club.logo_url}
              size="xl"
              className="size-28 md:size-36 text-3xl shadow-2xl"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-sm text-white"
                  style={{ backgroundColor: club.primary_color ?? "#E10600" }}
                >
                  KSL ${SITE_YEAR}
                </span>
                {leaguePosition && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border border-border text-muted-foreground">
                    อันดับที่ {leaguePosition}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9]">
                {club.name}
              </h1>
              {club.description && (
                <p className="text-sm text-muted-foreground mt-2 max-w-lg">
                  {club.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs sm:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-foreground/40">📍</span>
                  <span className="font-bold text-foreground">{club.home_venue ?? "-"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-foreground/40">★</span>
                  ก่อตั้ง <span className="font-bold text-foreground">{club.founded_year ?? "-"}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Season stat strip */}
          {standingRow && (
            <div className="mt-8 md:mt-10 grid grid-cols-3 sm:grid-cols-6 gap-px bg-border border border-border overflow-hidden rounded-sm">
              <HeroStat label="อันดับ" value={leaguePosition ? `#${leaguePosition}` : "—"} highlight />
              <HeroStat label="แต้ม" value={standingRow.points} />
              <HeroStat label="แข่ง" value={standingRow.played} />
              <HeroStat
                label="ช-ส-พ"
                value={`${standingRow.won}-${standingRow.drawn}-${standingRow.lost}`}
              />
              <HeroStat
                label="ประตู"
                value={`${standingRow.goals_for}:${standingRow.goals_against}`}
              />
              <HeroStat
                label="GD"
                value={
                  standingRow.goal_difference > 0
                    ? `+${standingRow.goal_difference}`
                    : `${standingRow.goal_difference}`
                }
              />
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 space-y-10 md:space-y-14">

        {/* ── พักฤดูกาล banner (phimai-fc only) ─────────────────── */}
        {slug === "phimai-fc" && (
          <div className="relative overflow-hidden border border-korat-gold/30 bg-korat-gold/5 p-6 md:p-8">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-korat-gold/10 to-transparent" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-korat-gold/15 border border-korat-gold/30 rounded-sm shrink-0">
                <span className="text-2xl">⏸️</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-korat-gold mb-1">
                  พักฤดูกาล {SITE_YEAR}
                </p>
                <p className="text-sm font-bold text-foreground">
                  ขอบคุณแฟนบอล แล้วเจอกันฤดูกาลหน้า
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  พิมาย เอฟซี พักการแข่งขันในฤดูกาล {SITE_YEAR} — ข้อมูลสโมสรและประวัติยังคงอยู่
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── FORM + RECENT RESULTS ──────────────────────────────────── */}
        {recentResults.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl md:text-2xl font-extrabold border-l-4 border-korat-red pl-3">
                ฟอร์มล่าสุด
              </h2>
              {form.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {form.map((r, i) => (
                    <span
                      key={i}
                      className={`size-7 md:size-8 inline-flex items-center justify-center text-[11px] font-extrabold rounded-sm ${
                        r === "W"
                          ? "bg-success text-white"
                          : r === "L"
                            ? "bg-korat-red text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {recentResults.map((m) => (
                <RecentResultCard key={m.id} match={m} club={club} />
              ))}
            </div>
          </section>
        )}

        {/* ── ประวัติสโมสร ──────────────────────────────────────── */}
        {club.history && (
          <section>
            <h2 className="font-display text-xl md:text-2xl font-extrabold mb-4 border-l-4 border-korat-red pl-3">
              ประวัติสโมสร
            </h2>
            <p className="text-sm leading-relaxed text-foreground/90">
              {club.history}
            </p>
          </section>
        )}

        {/* ── ข้อมูลสโมสร ──────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-xl md:text-2xl font-extrabold mb-4 border-l-4 border-korat-red pl-3">
            ข้อมูลสโมสร
          </h2>
          <div className="bg-card border border-border p-5 md:p-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                สีประจำทีม
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-full border-2 border-border shadow-md"
                  style={{ backgroundColor: club.primary_color ?? "#cc0000" }}
                />
                <span className="font-mono text-xs">{club.primary_color ?? "-"}</span>
              </div>
              {club.secondary_color && (
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-full border-2 border-border shadow-md"
                    style={{ backgroundColor: club.secondary_color }}
                  />
                  <span className="font-mono text-xs">{club.secondary_color}</span>
                </div>
              )}
            </div>
            <InfoRow label="ชื่อย่อ" value={club.short_name} />
            <InfoRow label="ชื่อเต็ม" value={club.name} />
            {club.description && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  คำอธิบาย
                </p>
                <p className="font-bold">{club.description}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── ข้อมูลสนามเหย้า ───────────────────────────────────── */}
        {club.stadium_name && (
          <section>
            <h2 className="font-display text-xl md:text-2xl font-extrabold mb-4 border-l-4 border-korat-red pl-3">
              สนามเหย้า
            </h2>
            <div className="bg-card border border-border p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg font-bold">{club.stadium_name}</p>
                {club.stadium_address && (
                  <p className="text-sm text-muted-foreground mt-1">{club.stadium_address}</p>
                )}
                {club.stadium_capacity && (
                  <p className="text-sm text-muted-foreground mt-2">
                    ความจุ {Number(club.stadium_capacity).toLocaleString("th-TH")} คน
                  </p>
                )}
              </div>
              {club.stadium_map_url && (
                <div className="flex items-start md:justify-end">
                  <a
                    href={club.stadium_map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-korat-red text-white text-sm font-bold rounded-sm hover:opacity-90 transition-opacity"
                  >
                    📍 ดูแผนที่ Google Maps
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── ผู้สนับสนุนหลัก ──────────────────────────────────── */}
        {clubSponsors.length > 0 && (
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-transparent">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-korat-red to-transparent" />

              <div className="px-5 py-8 md:px-10 md:py-10">
                {/* Section label */}
                <div className="text-center mb-6 md:mb-8">
                  <p className="text-[10px] font-extrabold tracking-[0.3em] text-korat-red uppercase mb-2">
                    {clubSponsors[0]?.tier}
                  </p>
                  <h2 className="font-display text-xl md:text-3xl font-extrabold tracking-tight">
                    ผู้สนับสนุนหลัก
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    ผู้สนับสนุนหลักอย่างเป็นทางการของสโมสร
                  </p>
                </div>

                {/* Sponsor showcase */}
                {clubSponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-5 md:gap-6"
                  >
                    {/* Logo card */}
                    <div className="relative flex items-center justify-center w-full max-w-md mx-auto">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center justify-center bg-white rounded-2xl p-6 md:p-10 shadow-2xl shadow-black/20 w-full">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="h-20 md:h-28 w-auto object-contain max-w-full transition-transform duration-300 group-hover:scale-[1.02]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Sponsor name */}
                    <p className="font-display text-base md:text-xl font-extrabold tracking-tight text-center group-hover:text-korat-red transition-colors">
                      {sponsor.name}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── นักเตะในทีม ────────────────────────────────────── */}
        <section>
          <h2 className="font-display text-xl md:text-2xl font-extrabold mb-4 border-l-4 border-korat-red pl-3">
            นักเตะในทีม ({filteredSquad.length})
          </h2>

          {/* Category tabs */}
          <div className="flex gap-2 mb-3 border-b border-border">
            {([
              { key: "senior", label: "ผู้ใหญ่", count: seniorPlayers.length },
              { key: "u16", label: "U-16", count: u16Players.length },
            ] as { key: DivCategory; label: string; count: number }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setSquadCategory(t.key)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors -mb-px border-b-2 ${
                  squadCategory === t.key
                    ? "border-korat-red text-white bg-korat-red/10"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>


          {/* Transfermarkt-style table */}
          {filteredSquad.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              ยังไม่มีข้อมูลนักเตะ
            </p>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-asphalt-deep text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <th className="w-12 text-center py-2">#</th>
                    <th className="text-left py-2 px-2">นักเตะ</th>
                    <th className="w-16 text-center py-2">ประตู</th>
                    <th className="w-16 text-center py-2">แอสซิสต์</th>
                  </tr>

                </thead>
                <tbody>
                  {filteredSquad.map((p, i) => (
                    <SquadRow key={p.id} player={p} index={i} clubColor={club.primary_color} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>


        {/* ── โปรแกรมและผลการแข่งขัน ────────────────────────── */}
        <section>
          <h2 className="font-display text-xl md:text-2xl font-extrabold mb-4 border-l-4 border-korat-red pl-3">
            โปรแกรมและผลการแข่งขัน
          </h2>

          <div className="flex gap-2 mb-4 border-b border-border">
            {([
              { key: "senior", label: "ชุดใหญ่" },
              { key: "u16", label: "U-16" },
            ] as { key: DivCategory; label: string }[]).map((t) => (
              <button
                key={t.key}
                onClick={() => setMatchTab(t.key)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors -mb-px border-b-2 ${
                  matchTab === t.key
                    ? "border-korat-red text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {matchTab === "u16" && !hasU16 ? (
            <div className="bg-card border border-border p-6 text-center text-muted-foreground text-sm">
              ไม่ได้ส่งทีม U-16
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMatches.map((m) => (
                <ClubMatchRow
                  key={m.id}
                  match={m}
                  club={club}
                  events={eventsByMatch[m.id] ?? []}
                />
              ))}

              {filteredMatches.length === 0 && (
                <p className="text-muted-foreground text-sm">ยังไม่มีโปรแกรมการแข่งขัน</p>
              )}
            </div>
          )}
        </section>

        {/* ── ที่เที่ยวใกล้เคียง ─────────────────────────────────── */}
        {(() => {
          const attractions = DISTRICT_ATTRACTIONS[club.district];
          if (!attractions || attractions.length === 0) return null;
          return (
            <section>
              <h2 className="font-display text-xl md:text-2xl font-extrabold mb-2 border-l-4 border-korat-red pl-3">
                🗺️ ที่เที่ยวใกล้สนาม
              </h2>
              <p className="text-sm text-muted-foreground mb-4 pl-4">
                สถานที่น่าสนใจในอำเภอ{club.district}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {attractions.map((a) => (
                  <div
                    key={a.name}
                    className="rounded-sm overflow-hidden border border-border bg-card hover:border-korat-red transition-colors group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={a.img}
                        alt={a.name}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm group-hover:text-korat-red transition-colors">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-card px-2 md:px-4 py-3 md:py-4 text-center">
      <div
        className={`font-display text-lg md:text-2xl font-extrabold tabular-nums leading-none ${
          highlight ? "text-korat-red" : "text-foreground"
        }`}
      >
        {value}
      </div>
      <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5">
        {label}
      </div>
    </div>
  );
}

function RecentResultCard({ match, club }: { match: any; club: any }) {
  const isHome = match.home.id === club.id;
  const opp = isHome ? match.away : match.home;
  const my = isHome ? match.home_score : match.away_score;
  const opp_s = isHome ? match.away_score : match.home_score;
  const outcome = my === opp_s ? "D" : my > opp_s ? "W" : "L";
  const outcomeColor =
    outcome === "W" ? "bg-success" : outcome === "L" ? "bg-korat-red" : "bg-muted";

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      className="bg-card border border-border p-3 flex items-center gap-3 hover:border-korat-red transition-colors group"
    >
      <span
        className={`size-8 shrink-0 inline-flex items-center justify-center text-xs font-extrabold rounded-sm text-white ${outcomeColor}`}
      >
        {outcome}
      </span>
      <ClubCrest
        shortName={opp.short_name}
        color={opp.primary_color}
        logoUrl={opp.logo_url}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {isHome ? "เหย้า" : "เยือน"} • MD{match.matchweek}
        </div>
        <div className="text-sm font-bold truncate group-hover:text-korat-red transition-colors">
          {opp.name}
        </div>
      </div>
      <div className="font-display text-lg font-extrabold tabular-nums shrink-0">
        {my}-{opp_s}
      </div>
    </Link>
  );
}

function ClubMatchRow({ match, club, events }: { match: any; club: any; events: any[] }) {
  const isHome = match.home.id === club.id;
  const opp = isHome ? match.away : match.home;
  const done = isFinished(match);

  const clubGoals = events
    .filter((e) => e.club?.short_name === club.short_name)
    .filter((e) => e.event_type === "goal" || e.event_type === "penalty" || e.event_type === "own_goal")
    .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0));

  const result = done
    ? match.home_score === match.away_score
      ? "เสมอ"
      : (isHome ? match.home_score > match.away_score : match.away_score > match.home_score)
        ? "ชนะ"
        : "แพ้"
    : null;

  return (
    <div className="bg-card border border-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="text-xs text-muted-foreground w-20 shrink-0">MD {match.matchweek}</div>
          <span className="text-xs shrink-0">{isHome ? "เหย้า" : "เยือน"}</span>
          <ClubCrest
            shortName={opp.short_name}
            color={opp.primary_color}
            logoUrl={opp.logo_url}
            size="sm"
          />
          <span className="font-bold text-sm truncate">{opp.name}</span>
        </div>

        <div className="flex items-center gap-4 sm:justify-end">
          {done ? (
            <>
              <span className="font-display text-lg font-extrabold tabular-nums">
                {isHome
                  ? `${match.home_score}-${match.away_score}`
                  : `${match.away_score}-${match.home_score}`}
              </span>
              <span
                className={`text-xs font-bold uppercase ${
                  result === "ชนะ"
                    ? "text-success"
                    : result === "แพ้"
                      ? "text-korat-red"
                      : "text-muted-foreground"
                }`}
              >
                {result}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">
              {new Date(match.kickoff_at).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>

      {done && clubGoals.length > 0 && (
        <div className="mt-3 pl-0 sm:pl-[132px] text-xs text-muted-foreground leading-relaxed">
          {clubGoals.map((g) => (
            <div key={g.id}>
              ⚽ {g.player?.name ?? "-"}{" "}
              <span className="text-korat-red font-bold">{g.minute ? `${g.minute}'` : ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function isFinished(match: any) {
  return match.status === "completed";
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold">{value ?? "-"}</p>
    </div>
  );
}

function SquadRow({
  player,
  index,
  clubColor,
}: {
  player: any;
  index: number;
  clubColor?: string | null;
}) {
  const initial = (player.name ?? "?").trim().charAt(0);



  return (
    <tr
      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
        index % 2 === 0 ? "bg-card" : "bg-background"
      }`}
    >
      <td
        className="w-12 text-center font-display text-lg font-extrabold tabular-nums py-2"
        style={{ color: player.jersey_number ? clubColor ?? "#E10600" : undefined }}
      >
        {player.jersey_number ?? <span className="text-muted-foreground">—</span>}
      </td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-3 min-w-0">
          {player.photo_url ? (
            <img
              src={player.photo_url}
              alt={player.name}
              className="size-8 rounded-full object-cover bg-muted shrink-0"
            />
          ) : (
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
              {initial}
            </div>
          )}
          <span className="font-medium text-sm truncate">{player.name}</span>
        </div>
      </td>
      

      <td
        className={`w-16 text-center tabular-nums text-sm py-2 ${
          (player.goals ?? 0) > 0 ? "font-bold text-white" : "text-muted-foreground"
        }`}
      >
        {player.goals ?? 0}
      </td>
      <td
        className={`w-16 text-center tabular-nums text-sm py-2 ${
          (player.assists ?? 0) > 0 ? "font-bold text-white" : "text-muted-foreground"
        }`}
      >
        {player.assists ?? 0}
      </td>
    </tr>
  );
}
