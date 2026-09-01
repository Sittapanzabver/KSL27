// src/routes/clubs.tsx
import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchActiveSeasonClubs, type Club } from "@/lib/queries";
import { ClubCrest } from "@/components/site/ClubCrest";
import { PageHeader } from "./standings";
import { GraduationCap } from "lucide-react";
import { buildHead, SITE_YEAR } from "@/lib/site";

const U16_HERO_URL = "/u16-hero.jpg";

export const Route = createFileRoute("/clubs")({
  component: ClubsLayout,
  head: () =>
    buildHead("สโมสร", `ทำความรู้จัก 7 สโมสรในศึก Korat Super League ${SITE_YEAR}`, "/clubs"),
});

function ClubsLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/clubs", fuzzy: false });
  return isIndex ? <ClubsPage /> : <Outlet />;
}

function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetchActiveSeasonClubs().then(setClubs);
  }, []);

  return (
    <div>
      {/* U-16 Academy Banner */}
      <div className="relative overflow-hidden border-b border-border bg-background">
        <div className="absolute inset-0 z-0">
          <img
            src={U16_HERO_URL}
            alt="KSL U-16 Academy"
            className="w-full h-full object-cover object-top opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-korat-gold/15 border border-korat-gold/30 rounded-sm">
                <GraduationCap className="size-6 text-korat-gold" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-korat-gold mb-0.5">
                  KSL Academy
                </p>
                <p className="text-sm font-bold text-foreground">
                  พัฒนาเยาวชนนักเตะ 120+ คน ใน 6 อำเภอนครราชสีมา
                </p>
              </div>
            </div>

            <div className="flex gap-px border border-border bg-border shrink-0">
              {[
                { n: "7", l: "สโมสร" },
                { n: "120+", l: "เยาวชน" },
                { n: "U-16", l: "หมวดอายุ" },
              ].map((s) => (
                <div key={s.l} className="bg-card px-4 py-3 text-center min-w-[64px]">
                  <div className="font-display text-lg font-extrabold tabular-nums text-korat-gold">
                    {s.n}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Club list */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <PageHeader
          eyebrow="The Clubs"
          title="สโมสร"
          subtitle={`7 สโมสรชั้นนำที่ลงแข่งในศึก Korat Super League ${SITE_YEAR}`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clubs.map((c) => (
            <Link
              key={c.id}
              to="/clubs/$slug"
              params={{ slug: c.slug }}
              className="relative bg-card border border-border p-6 hover:border-korat-red transition-colors group block overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-4">
                <ClubCrest
                  shortName={c.short_name}
                  color={c.primary_color}
                  logoUrl={c.logo_url}
                  size="xl"
                />
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-display text-lg font-extrabold leading-tight group-hover:text-korat-red transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{c.home_venue}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">ก่อตั้ง {c.founded_year}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground text-center">
                  รอฤดูกาล {SITE_YEAR}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-end">
                <span className="text-xs font-bold uppercase tracking-wider text-korat-red group-hover:translate-x-0.5 transition-transform">
                  ดูโปรไฟล์ →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Investor CTA */}
        <div className="mt-12 relative overflow-hidden border border-korat-gold/30 bg-korat-gold/5 p-8">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={U16_HERO_URL}
              alt=""
              className="w-full h-full object-cover opacity-5"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/80" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-korat-gold mb-1">
                Academy Sponsorship
              </p>
              <h3 className="font-display text-xl font-extrabold mb-2">
                ร่วมลงทุนในอนาคตเยาวชนโคราช
              </h3>
              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                สนับสนุน KSL Academy U-16 — โลโก้สปอนเซอร์บนชุดนักเตะ ป้ายสนาม
                และเว็บไซต์อย่างเป็นทางการ ใน 6 อำเภอ 120+ เยาวชน
              </p>
            </div>
            <Link
              to="/sponsors"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-korat-gold text-asphalt text-[11px] font-extrabold uppercase tracking-widest hover:brightness-110 transition-all whitespace-nowrap"
            >
              ติดต่อสปอนเซอร์ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
