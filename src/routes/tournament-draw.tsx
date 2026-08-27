import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchClubs } from "@/lib/queries";
import {
  knockoutBracket,
  roundRobin,
  groupDraw,
  rngFromSeed,
  FORMATS,
  type FormatId,
} from "@/lib/draw";
import { ClubCrest } from "@/components/site/ClubCrest";
import { PageHeader } from "./standings";
import { SITE_YEAR } from "@/lib/site";

// หน้า preview การจับฉลาก — ผูกกับ SITE_YEAR (ฤดูกาลหลัก) เช่น 2027
const PREVIEW_YEAR = Number(SITE_YEAR);

export const Route = createFileRoute("/tournament-draw")({
  component: TournamentDrawPage,
  head: () => ({
    meta: [
      { title: `จับฉลากทัวร์นาเมนต์ ${PREVIEW_YEAR} — KSL` },
      { name: "description", content: `ลองจับฉลาก / จับคู่ทัวร์นาเมนต์สมมุติ ${PREVIEW_YEAR} for Korat Super League — แพ้คัดออก, พบกันหมด, แบ่งกลุ่ม` },
    ],
    links: [],
  }),
});

function TournamentDrawPage() {
  const [format, setFormat] = useState<FormatId>("knockout");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [manualTeams, setManualTeams] = useState("");
  const [seed, setSeed] = useState("");
  const [drawn, setDrawn] = useState<null | { rounds: { label: string; matches: { home: string; away: string }[] }[]; groups: string[][] }>(null);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    fetchClubs().then((d) => setClubs(d as any[])).catch(() => setClubs([]));
  }, []);

  const clubShortName = (name: string) => {
    const c = clubs.find((x) => x.name === name || x.short_name === name);
    return c ? c.short_name : name;
  };

  const toggle = (name: string) => {
    setSelected((prev) => {
      const nx = new Set(prev);
      nx.has(name) ? nx.delete(name) : nx.add(name);
      return nx;
    });
  };

  const selectAll = () => {
    const names = clubs.map((c) => c.name);
    setSelected(new Set(names));
  };

  const teamNames = useMemo(() => {
    const manual = manualTeams
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const manualSet = new Set(manual);
    const clubNames = clubs.map((c) => c.name).filter((n) => !manualSet.has(n));
    // chosen = manual entries + selected clubs
    const chosenMan = [...manual];
    const chosenClubs = clubNames.filter((n) => selected.has(n));
    return [...chosenMan, ...chosenClubs];
  }, [manualTeams, clubs, selected]);

  const buildDraw = () => {
    const names = teamNames;
    if (names.length < 2) return;
    const rng = seed ? rngFromSeed(seed) : undefined;
    const shuffledTeams = seed ? (() => {
      // deterministic ordering via seeded shuffle, reproduced inside groupDraw/knockout
      const a = names.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng!() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    })() : names;

    if (format === "knockout") {
      const bracket = knockoutBracket(shuffledTeams);
      const rounds = bracket.map((round, i) => ({
        label: `รอบ ${i === 0 ? "แรก" : i + 1}`,
        matches: round,
      }));
      setDrawn({ rounds, groups: [] });
    } else if (format === "roundrobin") {
      const rounds = roundRobin(shuffledTeams);
      setDrawn({
        rounds: rounds.map((rd, i) => ({ label: `นัดที่ ${i + 1}`, matches: rd })),
        groups: [],
      });
    } else {
      const nGroups = names.length <= 8 ? 2 : names.length <= 12 ? 3 : 4;
      const groups = groupDraw(names, nGroups, seed ? rngFromSeed(seed) : undefined);
      setDrawn({
        rounds: [],
        groups: groups.map((rds) => [
          ...new Set(rds.flatMap((rd) => rd.flatMap((m) => [m.home, m.away]))),
        ]),
      });
    }
  };

  const hasGroups = drawn && drawn.groups.length > 0 && drawn.rounds.length === 0;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
      <PageHeader
        eyebrow="Tournament Draw"
        title={`จับฉลากทัวร์นาเมนต์ ${PREVIEW_YEAR}`}
        subtitle={`ทดลองจับฉลาก / จับคู่ทัวร์นาเมนต์สมมุติ ${PREVIEW_YEAR} เพื่อซ้อมแนวทางจัดการแข่งขัน (ใช้งานจริงเมื่อเปิดฤดูกาล)`}
      />

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Format */}
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <h2 className="font-display font-bold text-lg mb-3">รูปแบบแข่งขัน</h2>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  format === f.id
                    ? "bg-korat-red text-white"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.th}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground">Seed code (วาดซ้ำได้)</label>
            <input
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="เช่น ksl2027 (เว้นว่าง = สุ่ม)"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Teams */}
        <div className="rounded-xl border border-border bg-card p-5 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">ทีมที่เข้าร่วม ({teamNames.length})</h2>
            <button onClick={selectAll} className="text-sm font-semibold text-korat-red hover:underline">
              เลือกทั้งหมด
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {clubs.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c.name)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  selected.has(c.name)
                    ? "border-korat-red bg-korat-red/10 text-korat-red"
                    : "border-border text-muted-foreground hover:border-korat-red/40"
                }`}
              >
                <ClubCrest shortName={c.short_name} color={c.primary_color} logoUrl={c.logo_url} size="sm" />
                {c.name}
              </button>
            ))}
          </div>

          <label className="text-[11px] uppercase tracking-widest text-muted-foreground">หรือเพิ่มทีมเอง (คั่นด้วย , / newline)</label>
          <textarea
            value={manualTeams}
            onChange={(e) => setManualTeams(e.target.value)}
            rows={2}
            placeholder={"ทีม A, ทีม B"}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={buildDraw}
        disabled={teamNames.length < 2}
        className="mt-6 w-full md:w-auto px-8 py-3 rounded-full font-display font-bold text-white bg-korat-red hover:bg-korat-red/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-lg"
      >
        🎲 จับฉลากเลย
      </button>

      {/* Result */}
      {drawn && (
        <div className="mt-8 space-y-8">
          <div className="text-sm text-muted-foreground">
            ผลจับฉลากแบบ <span className="font-bold text-foreground">{FORMATS.find((f) => f.id === format)?.th}</span>
            {seed && <> · seed <code className="rounded bg-secondary px-1.5 py-0.5">{seed}</code> (ใส่ seed เดิมจับซ้ำได้)</>}
          </div>

          {hasGroups && (
            <div className="grid md:grid-cols-2 gap-4">
              {drawn.groups.map((g, gi) => (
                <div key={gi} className="rounded-xl border border-border bg-card p-4 card-shadow">
                  <h3 className="font-display font-bold mb-2">กลุ่ม {String.fromCharCode(65 + gi)}</h3>
                  <ul className="space-y-1">
                    {g.map((n) => (
                      <li key={n} className="flex items-center gap-2 text-sm">
                        <ClubCrest shortName={clubShortName(n)} color="" logoUrl="" size="sm" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {drawn.rounds.length > 0 && (
            <div className="space-y-6 overflow-x-auto">
              {drawn.rounds.map((rd, i) => (
                <div key={i}>
                  <h3 className="font-display font-bold uppercase tracking-wide text-korat-red mb-2">{rd.label}</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 min-w-[480px]">
                    {rd.matches.map((m, mi) => (
                      <div key={mi} className="rounded-lg border border-border bg-card p-3 card-shadow">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <ClubCrest shortName={clubShortName(m.home)} color="" logoUrl="" size="sm" />
                          <span className="truncate">{m.home}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground text-center my-1">vs</div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <ClubCrest shortName={clubShortName(m.away)} color="" logoUrl="" size="sm" />
                          <span className="truncate">{m.away}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
