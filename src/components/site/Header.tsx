import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SITE_YEAR } from "@/lib/site";
import { WayfinderSearchBar } from "@/components/wayfinder/WayfinderSearchBar";

type NavKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

type NavItem =
  | { type: "link"; to: string; key: NavKey }
  | { type: "group"; key: NavKey; items: { to: string; key: NavKey }[] };

const navItems: NavItem[] = [
  { type: "link", to: "/", key: "nav.home" },
  {
    type: "group",
    key: "nav.competition",
    items: [
      { to: "/standings", key: "nav.standings" },
      { to: "/matches", key: "nav.matches" },
    ],
  },
  { type: "link", to: "/clubs", key: "nav.clubsAndSquads" },
  { type: "link", to: "/top-scorers", key: "nav.players" },
  { type: "link", to: "/billboard", key: "nav.build" },
  { type: "link", to: "/news", key: "nav.news" },
  { type: "link", to: "/sponsors", key: "nav.sponsors" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkBase =
    "relative text-sm font-semibold tracking-wide uppercase text-white/90 hover:text-white transition-colors py-1 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-korat-red after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100";

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-[0_4px_20px_-6px_rgba(0,0,0,0.6)]" : ""}`}
    >
      {/* Thin red top bar */}
      <div className="h-1 w-full bg-korat-red" />

      <div className="bg-asphalt/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="shrink-0">
              <img
                src="/ksl-logo-2027.jpg"
                alt="KSL 2027 Logo"
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/15 shadow-lg transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_14px_rgba(204,0,0,0.4)]"
              />
            </div>
            <div className="hidden sm:block leading-none">
              <div className="font-display font-extrabold text-lg tracking-tight text-white group-hover:text-korat-red transition-colors">
                KORAT SUPER LEAGUE
              </div>
              <div className="text-[10px] text-korat-gold tracking-[0.3em] uppercase mt-1">
                Season {SITE_YEAR}
              </div>
            </div>
          </Link>

          {/* Wayfinder Search Bar — center */}
          <WayfinderSearchBar />

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => {
              if (item.type === "group") {
                return (
                  <div key={item.key} className="relative group">
                    <button className={`${linkBase} inline-flex items-center gap-1`}>
                      {t(item.key)}
                      <ChevronDown className="size-3.5" />
                    </button>
                    <div className="absolute left-0 top-full pt-3 hidden group-hover:block min-w-[180px]">
                      <div className="bg-asphalt border border-korat-red/30 shadow-xl py-2">
                        {item.items.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            className="block px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-korat-red/10 hover:text-korat-red"
                            activeProps={{ className: "text-korat-red bg-korat-red/10" }}
                          >
                            {t(sub.key)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={linkBase}
                  activeProps={{ className: "text-korat-red after:scale-x-100" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            <button
              className="p-2 -mr-2 text-white"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden border-t border-white/10 bg-asphalt">
            <div className="px-4 py-3 flex flex-col">
              {navItems
                .flatMap((item) => (item.type === "group" ? item.items : [item]))
                .map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="py-3 text-sm font-semibold tracking-wide uppercase border-b border-white/5"
                    activeProps={{ className: "text-korat-red" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {t(item.key)}
                  </Link>
                ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
