import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import districtsData from "@/data/korat-districts.geojson?url";

type ClubLite = {
  slug: string;
  name: string;
  short_name: string;
  primary_color?: string | null;
  logo_url?: string | null;
};

// Map district Thai name -> array of club slugs
const DISTRICT_TO_CLUBS: Record<string, string[]> = {
  เมืองนครราชสีมา: ["union-korat", "suranaree-fc"],
  ขามสะแกแสง: ["khamsakaesaeng-fc"],
  พิมาย: ["phimai-fc"],
  เสิงสาง: ["soengsang-united"],
  ครบุรี: ["khonburi-fc"],
  ปักธงชัย: ["pakthongchai-united"],
  โนนแดง: ["nondaeng-fc"],
};

interface Props {
  clubsBySlug: Map<string, ClubLite>;
}

export function DistrictMap({ clubsBySlug }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const geoRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(navigate);
  navRef.current = navigate;
  const clubsRef = useRef(clubsBySlug);
  clubsRef.current = clubsBySlug;

  // Memoize a stable key for clubs (slug + logo presence) to trigger marker refresh
  const clubsKey = useMemo(() => {
    return Array.from(clubsBySlug.entries())
      .map(([s, c]) => `${s}:${c.logo_url ?? ""}:${c.primary_color ?? ""}`)
      .sort()
      .join("|");
  }, [clubsBySlug]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      const geo = await fetch(districtsData).then((r) => r.json());
      if (cancelled || !containerRef.current) return;
      LRef.current = L;
      geoRef.current = geo;

      const map = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: true,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 14,
          minZoom: 7,
          subdomains: "abcd",
          attribution: "&copy; OpenStreetMap &copy; CARTO",
        }
      ).addTo(map);

      const styleFor = (name: string) => {
        const active = !!DISTRICT_TO_CLUBS[name]?.length;
        return active
          ? {
              color: "#cc0000",
              weight: 1.5,
              fillColor: "#cc0000",
              fillOpacity: 0.35,
            }
          : {
              color: "#1e3a8a",
              weight: 1,
              fillColor: "#0a1628",
              fillOpacity: 0.55,
            };
      };

      const layer = L.geoJSON(geo, {
        style: (f: any) => styleFor(f.properties.name_th),
        onEachFeature: (feature: any, lyr: any) => {
          const name = feature.properties.name_th;
          const slugs = DISTRICT_TO_CLUBS[name] ?? [];
          const isActive = slugs.length > 0;

          if (isActive) {
            const clubs = slugs
              .map((s) => clubsRef.current.get(s))
              .filter(Boolean) as ClubLite[];
            const title = clubs.map((c) => c.name).join(" · ");
            lyr.bindTooltip(
              `<div style="font-weight:700">${name}</div><div style="opacity:.8;font-size:11px">${title}</div>`,
              { direction: "top", offset: [0, -4] }
            );
            lyr.on("click", () => {
              if (clubs[0]) {
                navRef.current({
                  to: "/clubs/$slug",
                  params: { slug: clubs[0].slug },
                });
              }
            });
          } else {
            lyr.bindTooltip(
              `<div style="font-weight:700">${name}</div><div style="opacity:.8;font-size:11px">Slot available · เปิดรับทีมใหม่</div>`,
              { direction: "top", offset: [0, -4] }
            );
          }

          lyr.on("mouseover", () => {
            lyr.setStyle({
              weight: 2.5,
              color: "#f0b429",
              fillOpacity: isActive ? 0.6 : 0.75,
            });
            lyr.bringToFront();
          });
          lyr.on("mouseout", () => {
            lyr.setStyle(styleFor(name));
          });
        },
      }).addTo(map);

      map.fitBounds(layer.getBounds(), { padding: [10, 10] });

      setReady(true);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(containerRef.current!);
      (map as any)._ro = ro;
    })();

    return () => {
      cancelled = true;
      const m = mapRef.current;
      if (m) {
        (m as any)._ro?.disconnect?.();
        m.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Rebuild club logo markers whenever clubs data changes
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    const geo = geoRef.current;
    if (!map || !L || !geo) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    for (const feature of geo.features) {
      const name = feature.properties.name_th;
      const slugs = DISTRICT_TO_CLUBS[name] ?? [];
      if (!slugs.length) continue;
      const [lng, lat] = feature.properties.centroid;
      const clubs = slugs
        .map((s) => clubsRef.current.get(s))
        .filter(Boolean) as ClubLite[];
      if (!clubs.length) continue;

      const size = 32;
      const gap = 2;
      const width = clubs.length * size + (clubs.length - 1) * gap;
      const html = `
        <div style="display:flex;gap:${gap}px;align-items:center;justify-content:center;width:${width}px;height:${size}px;">
          ${clubs
            .map((c) => {
              const bg = c.primary_color || "#cc0000";
              const inner = c.logo_url
                ? `<img src="${c.logo_url}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:9999px;display:block;"/>`
                : "";
              return `<a href="/clubs/${c.slug}" data-slug="${c.slug}" title="${c.name}" style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${bg};border:2px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.5);overflow:hidden;box-sizing:border-box;">${inner}</a>`;
            })
            .join("")}
        </div>`;

      const icon = L.divIcon({
        html,
        className: "ksl-club-marker",
        iconSize: [width, size],
        iconAnchor: [width / 2, size / 2],
      });
      const marker = L.marker([lat, lng], { icon, riseOnHover: true }).addTo(map);
      marker.on("click", (e: any) => {
        const target = e.originalEvent?.target as HTMLElement | undefined;
        const slug =
          target?.closest("[data-slug]")?.getAttribute("data-slug") ||
          clubs[0]?.slug;
        if (slug) {
          navRef.current({ to: "/clubs/$slug", params: { slug } });
        }
      });
      markersRef.current.push(marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, clubsKey]);

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[600px] bg-asphalt-deep border border-border overflow-hidden">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ background: "#060f1e" }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          กำลังโหลดแผนที่...
        </div>
      )}
    </div>
  );
}
