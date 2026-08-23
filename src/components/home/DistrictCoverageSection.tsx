import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { ClubCrest } from "@/components/site/ClubCrest";
import { DistrictMap } from "@/components/site/DistrictMap";
import { CLUB_FALLBACKS, type ClubLite } from "@/constants/clubFallbacks";
import { DISTRICT_SLOTS } from "@/constants/districtSlots";
import { fetchClubs } from "@/lib/queries";
import { SITE_YEAR } from "@/lib/site";

function CoverageStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card px-4 py-3 text-center">
      <div className="font-display text-2xl font-extrabold tabular-nums text-white">
        {value}
      </div>
      <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function DistrictCoverageSection({ standings }: { standings: any[] }) {
  const [allClubs, setAllClubs] = useState<any[]>([]);

  useEffect(() => {
    fetchClubs().then(setAllClubs).catch(() => setAllClubs([]));
  }, []);

  const clubsBySlug = new Map<string, ClubLite>(
    Object.entries(CLUB_FALLBACKS).map(([slug, club]) => [slug, club])
  );

  // Merge from fetched clubs (covers all divisions)
  allClubs.forEach((club) => {
    if (!club?.slug) return;
    clubsBySlug.set(club.slug, {
      ...(CLUB_FALLBACKS[club.slug] ?? {}),
      ...club,
    });
  });

  // Then overlay standings club data (latest)
  standings
    .map((row) => row.club)
    .filter(Boolean)
    .forEach((club) =>
      clubsBySlug.set(club.slug, {
        ...(CLUB_FALLBACKS[club.slug] ?? {}),
        ...(clubsBySlug.get(club.slug) ?? {}),
        ...club,
      })
    );
  const activeDistricts = DISTRICT_SLOTS.filter((slot) => slot.clubSlugs?.length).length;
  const activeClubs = DISTRICT_SLOTS.reduce(
    (sum, slot) => sum + (slot.clubSlugs?.length ?? 0),
    0
  );

  return (
    <section className="border-b border-border bg-asphalt-deep">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-7 bg-korat-red" />
              <span className="text-[10px] font-bold tracking-[0.24em] text-korat-red uppercase">
                32 Districts · One League
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-none">
              32 อำเภอ หนึ่งลีก
            </h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              โครงสร้างของ Korat Super League ครอบคลุมทุกอำเภอของจังหวัดนครราชสีมา
              อำเภอไหนมีทีมแล้วจะแสดงตราสโมสรในช่องอำเภอนั้น และหนึ่งอำเภอสามารถมีได้มากกว่าหนึ่งสโมสร
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border border border-border min-w-full sm:min-w-[360px] lg:min-w-[420px]">
            <CoverageStat value="32" label="อำเภอ" />
            <CoverageStat value={String(activeDistricts)} label="อำเภอมีทีม" />
            <CoverageStat value={String(activeClubs)} label={`สโมสร ${SITE_YEAR}`} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <DistrictMap clubsBySlug={clubsBySlug} />

          <div className="border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-korat-red">
                Active Districts
              </div>
              <div className="mt-1 font-display text-xl font-extrabold">
                อำเภอที่มีสโมสร
              </div>
            </div>
            <div className="divide-y divide-border">
              {DISTRICT_SLOTS.filter((slot) => slot.clubSlugs?.length).map((slot) => {
                const clubs = (slot.clubSlugs ?? []).flatMap((slug) => {
                  const club = clubsBySlug.get(slug);
                  return club ? [club] : [];
                });

                return (
                  <div key={slot.name} className="px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold">
                      <MapPin className="size-3.5 text-korat-red" />
                      {slot.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {clubs.map((club) => (
                        <Link
                          key={club.slug}
                          to="/clubs/$slug"
                          params={{ slug: club.slug }}
                          className="inline-flex items-center gap-2 border border-border bg-asphalt px-2 py-1 text-[11px] font-bold transition-colors hover:border-korat-red hover:text-korat-red"
                          title={club.name}
                        >
                          <ClubCrest
                            shortName={club.short_name}
                            color={club.primary_color}
                            logoUrl={club.logo_url}
                            size="sm"
                          />
                          {club.short_name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5 text-korat-red" />
            โลโก้บนแผนที่กดเพื่อเข้าหน้าสโมสรได้ทันที และหนึ่งอำเภอแสดงได้มากกว่าหนึ่งสโมสร
          </p>
          <p className="uppercase tracking-widest text-muted-foreground/70">
            Empty districts are open for new clubs
          </p>
        </div>
      </div>
    </section>
  );
}
