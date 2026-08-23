#!/usr/bin/env node
/**
 * social.mjs — Content/Output workflow: ข้อมูล Supabase → โพสต์พร้อมเผยแพร่
 *
 * ดึงข้อมูลจริง (anon key — อ่านได้สาธารณะ ไม่แตะข้อมูล) แล้วพิมพ์:
 *   - ผลการแข่งขันล่าสุด (แมตช์เดย์ล่าสุดของ Super League)
 *   - ตารางคะแนน (คำนวณจากผลแข่ง — ตรงกับที่เว็บแสดง)
 *   - ดาวซัลโว
 *   - ข่าวล่าสุด
 * ใช้เวลาคนน้อยลง: คัดลอกจาก output/social-YYYYMMDD.md ไปโพสต์ได้เลย
 *
 * รัน: node --env-file=.env scripts/social.mjs   (หรือ npm run social)
 */
import fs from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
const SUPER_LEAGUE_DIVISION = "bd770ed0-a2f2-47e0-ab34-901a151e9f7c";
const SITE_URL = "https://koratsuperleague.lovable.app";
const HASHTAGS = "#KSL2026 #KoratSuperLeague #ฟุตบอลโคราช";

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("❌ ต้องรันด้วย env: node --env-file=.env scripts/social.mjs");
  process.exit(1);
}

async function q(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

/** คอลัมน์สาธารณะของ matches (ต้องไม่ขอคอลัมน์การเงินที่ revoke จาก anon) */
const MATCH_COLS = "id,matchweek,kickoff_at,home_club_id,away_club_id,home_score,away_score,status";

const today = new Intl.DateTimeFormat("th-TH", {
  year: "numeric", month: "long", day: "numeric",
}).format(new Date());

const fmtDate = (iso) =>
  new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short" }).format(new Date(iso));

function clubName(map, id) {
  return map.get(id)?.name ?? map.get(id)?.short_name ?? "(ไม่ทราบสโมสร)";
}

/** คำนวณตารางคะแนนจากผลแข่ง — ตรงกับที่เว็บแสดง (calculateStandings) */
function computeStandings(matches) {
  const t = new Map();
  const ensure = (id) => {
    if (!t.has(id)) {
      t.set(id, { club_id: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 });
    }
    return t.get(id);
  };
  for (const m of matches) {
    if (m.home_score == null || m.away_score == null) continue;
    const h = ensure(m.home_club_id);
    const a = ensure(m.away_club_id);
    h.played++; a.played++;
    h.gf += m.home_score; h.ga += m.away_score;
    a.gf += m.away_score; a.ga += m.home_score;
    if (m.home_score > m.away_score) { h.won++; a.lost++; h.points += 3; }
    else if (m.home_score < m.away_score) { a.won++; h.lost++; a.points += 3; }
    else { h.drawn++; a.drawn++; h.points++; a.points++; }
  }
  return [...t.values()].sort(
    (x, y) => y.points - x.points || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf
  );
}

async function main() {
  const [clubs, topScorers, news, matches] = await Promise.all([
    q("clubs", "select=id,name,short_name&status=eq.active"),
    q("top_scorers", "select=name,club_code,goals&category=eq.senior&season=eq.2026&order=goals.desc&limit=5"),
    q("news", "select=title,slug,excerpt&is_published=eq.true&order=published_at.desc&limit=3"),
    q("matches", `select=${MATCH_COLS}&status=eq.completed&division_id=eq.${SUPER_LEAGUE_DIVISION}&order=kickoff_at.desc`),
  ]);

  const clubMap = new Map(clubs.map((c) => [c.id, c]));
  const clubByCode = new Map(clubs.map((c) => [c.short_name, c.name]));
  const lines = [];
  lines.push(`# สรุปโพสต์ KSL — ${today}`);
  lines.push("");
  lines.push("> คัดลอกส่วนที่ต้องการไปโพสต์ได้เลย (Facebook / LINE)");

  const standings = computeStandings(matches);

  // ── ผลการแข่งขันล่าสุด (แมตช์เดย์ล่าสุด) ─────────────
  if (matches.length) {
    const latestMw = Math.max(...matches.map((m) => m.matchweek));
    const latest = matches
      .filter((m) => m.matchweek === latestMw)
      .sort((a, b) => a.kickoff_at.localeCompare(b.kickoff_at));
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push(`## 📋 สรุปผลการแข่งขัน — แมตช์เดย์ ${latestMw}`);
    lines.push("");
    for (const m of latest) {
      const home = clubName(clubMap, m.home_club_id);
      const away = clubName(clubMap, m.away_club_id);
      lines.push(`⚽ ${fmtDate(m.kickoff_at)} · ${home} ${m.home_score}–${m.away_score} ${away}`);
    }
    lines.push("");
    lines.push(`ผลและตารางคะแนนเต็ม: ${SITE_URL}/standings`);
    lines.push(HASHTAGS);
  }

  // ── ตารางคะแนน (คำนวณจากผลแข่ง) ───────────────────
  if (standings.length) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## 🏆 ตารางคะแนนล่าสุด");
    lines.push("");
    standings.slice(0, 8).forEach((s, i) => {
      const name = clubName(clubMap, s.club_id);
      const badge = i === 0 ? " 🏆" : "";
      lines.push(`${i + 1}. ${name} — ${s.points} แต้ม (${s.played} นัด)${badge}`);
    });
    lines.push("");
    lines.push(`ตารางเต็ม: ${SITE_URL}/standings`);
    lines.push(HASHTAGS);
  }

  // ── ดาวซัลโว ───────────────────────────────────────
  if (topScorers.length) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## ⚽ ดาวซัลโว (Super League 2026)");
    lines.push("");
    topScorers.forEach((p, i) => {
      const club = clubByCode.get(p.club_code);
      lines.push(`${i + 1}. ${p.name}${club ? ` (${club})` : ""} — ${p.goals} ประตู`);
    });
    lines.push("");
    lines.push(HASHTAGS);
  }

  // ── ข่าวล่าสุด ──────────────────────────────────────
  if (news.length) {
    lines.push("");
    lines.push("---");
    lines.push("");
    lines.push("## 📰 ข่าวล่าสุด");
    lines.push("");
    for (const n of news) {
      lines.push(`📌 ${n.title}`);
      if (n.excerpt) lines.push(`   ${n.excerpt}`);
      lines.push(`   ${SITE_URL}/news/${n.slug}`);
      lines.push("");
    }
    lines.push(HASHTAGS);
  }

  const output = lines.join("\n");
  console.log(output);

  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const dir = path.resolve(import.meta.dirname, "../output");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `social-${stamp}.md`);
  fs.writeFileSync(file, output + "\n", "utf8");
  console.log("");
  console.log(`📄 บันทึกไฟล์แล้ว: ${file}`);
}

main().catch((err) => {
  console.error("❌ เกิดข้อผิดพลาด:", err.message);
  process.exit(1);
});
