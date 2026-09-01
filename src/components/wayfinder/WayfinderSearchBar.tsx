/**
 * WayfinderSearchBar — Global search bar ตรงกลาง Header
 * ค้นหาทุกอย่าง: สโมสร, อำเภอ, นักเตะ, ข่าว, แมตช์
 * Real-time autocomplete + group ตาม category
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, MapPin, Users, Newspaper, Trophy, ArrowRight } from "lucide-react";
import { fetchActiveSeasonClubs, fetchNews, fetchAllPlayers } from "@/lib/queries";
import { CLUB_FALLBACKS } from "@/constants/clubFallbacks";
import { SITE_YEAR } from "@/lib/site";

type ActiveClub = Awaited<ReturnType<typeof fetchActiveSeasonClubs>>[number];
type Player = Awaited<ReturnType<typeof fetchAllPlayers>>[number];
type NewsItem = Awaited<ReturnType<typeof fetchNews>>[number];

/** District list — 32 อำเภอ นครราชสีมา */
const DISTRICTS = [
  "เมืองนครราชสีมา",
  "ครบุรี",
  "เสิงสาง",
  "คง",
  "บ้านเหลื่อม",
  "จักราช",
  "โชคชัย",
  "ด่านขุนทด",
  "โนนไทย",
  "โนนสูง",
  "ขามสะแกแสง",
  "บัวใหญ่",
  "ประทาย",
  "ปักธงชัย",
  "พิมาย",
  "ห้วยแถลง",
  "ชุมพวง",
  "สูงเนิน",
  "ขามทะเลสอ",
  "สีคิ้ว",
  "ปากช่อง",
  "หนองบุญมาก",
  "แก้งสนามนาง",
  "โนนแดง",
  "วังน้ำเขียว",
  "เทพารักษ์",
  "เมืองยาง",
  "พระทองคำ",
  "ลำทะเมนชัย",
  "บัวลาย",
  "สีดา",
  "เฉลิมพระเกียรติ",
];

/** Simplified search result types */
type SearchCategory = "สโมสร" | "อำเภอ" | "นักเตะ" | "ข่าว";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  icon: React.ReactNode;
}

/** Simple fuzzy match */
function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // Simple character-by-character match
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function WayfinderSearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [clubs, setClubs] = useState<ActiveClub[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load data on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [c, p, n] = await Promise.all([
          fetchActiveSeasonClubs(),
          fetchAllPlayers(),
          fetchNews(20),
        ]);
        if (active) {
          setClubs(c);
          setPlayers(p);
          setNews(n);
        }
      } catch {
        // Graceful — use fallbacks
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Search results
  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim();
    const items: SearchResult[] = [];

    // Clubs
    const clubList = clubs.length > 0 ? clubs : Object.values(CLUB_FALLBACKS);
    for (const c of clubList) {
      if (fuzzyMatch(q, c.name) || fuzzyMatch(q, c.short_name) || fuzzyMatch(q, c.slug)) {
        items.push({
          id: `club-${c.slug}`,
          title: c.name,
          subtitle: c.short_name,
          category: "สโมสร",
          href: `/clubs/${c.slug}`,
          icon: <Trophy className="size-4" />,
        });
      }
    }

    // Districts
    for (const d of DISTRICTS) {
      if (fuzzyMatch(q, d)) {
        items.push({
          id: `district-${d}`,
          title: d,
          subtitle: "อำเภอในนครราชสีมา",
          category: "อำเภอ",
          href: `/clubs`, // Could link to filtered clubs
          icon: <MapPin className="size-4" />,
        });
      }
    }

    // Players
    for (const p of players) {
      if (!p.club?.slug) continue;
      if (fuzzyMatch(q, p.name)) {
        items.push({
          id: `player-${p.id}`,
          title: p.name,
          subtitle: p.club.name,
          category: "นักเตะ",
          href: `/clubs/${p.club.slug}`,
          icon: <Users className="size-4" />,
        });
      }
    }

    // News
    for (const n of news) {
      if (fuzzyMatch(q, n.title) || fuzzyMatch(q, n.excerpt || "")) {
        items.push({
          id: `news-${n.id}`,
          title: n.title,
          subtitle: n.category || "ข่าว",
          category: "ข่าว",
          href: `/news/${n.slug}`,
          icon: <Newspaper className="size-4" />,
        });
      }
    }

    return items.slice(0, 20); // Limit results
  }, [query, clubs, players, news]);

  // Group results by category
  const grouped = useMemo(() => {
    const groups: Record<SearchCategory, SearchResult[]> = {
      สโมสร: [],
      อำเภอ: [],
      นักเตะ: [],
      ข่าว: [],
    };
    for (const r of results) {
      groups[r.category].push(r);
    }
    return groups;
  }, [results]);

  const hasResults = results.length > 0;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {/* Search input */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
          isOpen
            ? "bg-white/10 border-korat-red/50 w-64 lg:w-80"
            : "bg-white/5 border-white/10 w-48 lg:w-56 hover:bg-white/8 hover:border-white/20"
        }`}
      >
        <Search className="size-4 text-white/50 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="ค้นหา..."
          className="bg-transparent text-sm text-white placeholder:text-white/40 outline-none w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="text-white/40 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-asphalt border border-white/10 shadow-2xl rounded-lg overflow-hidden max-h-[400px] overflow-y-auto z-50">
          {hasResults ? (
            <>
              {/* Group by category */}
              {(["สโมสร", "อำเภอ", "นักเตะ", "ข่าว"] as const).map((cat) => {
                const items = grouped[cat];
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 border-b border-white/5">
                      {cat}
                    </div>
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors group"
                      >
                        <span className="text-white/40 group-hover:text-korat-red transition-colors">
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate group-hover:text-korat-red transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-white/40 truncate">{item.subtitle}</div>
                        </div>
                        <ArrowRight className="size-3 text-white/20 group-hover:text-korat-red transition-colors" />
                      </Link>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-white/40 text-sm">
              ไม่พบผลลัพธ์สำหรับ "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
