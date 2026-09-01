import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchActiveSeasonClubs, type Club } from "@/lib/queries";
import { MediaMetricsSection } from "@/components/sponsors/MediaMetricsSection";
import { PackagesSection } from "@/components/sponsors/PackagesSection";
import { EcosystemSection } from "@/components/sponsors/EcosystemSection";
import { OfficialPartnersSection } from "@/components/sponsors/OfficialPartnersSection";
import { FinalCtaSection } from "@/components/sponsors/FinalCtaSection";
import { buildHead, SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
  head: () =>
    buildHead(
      "สปอนเซอร์",
      `แพ็กเกจสนับสนุนและพันธมิตรอย่างเป็นทางการของ Korat Super League ${SITE_YEAR}`,
      "/sponsors",
    ),
});

function SponsorsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetchActiveSeasonClubs().then(setClubs);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="relative overflow-hidden">
        <img
          src="/u16-hero.jpg"
          alt="KSL Academy U-16"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-korat-gold" />
            <span className="text-[10px] font-bold tracking-[0.24em] text-korat-gold uppercase">
              KSL Sponsorship · Season ${SITE_YEAR}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] text-white mb-6">
            ลงทุนใน
            <br />
            <span className="text-korat-gold">อนาคตโคราช</span>
          </h1>
          <p className="text-base md:text-lg text-white/65 max-w-2xl leading-relaxed">
            สนับสนุน Korat Super League และ KSL Academy U-16 — แบรนด์ของคุณเข้าถึงชุมชนฟุตบอล 6
            อำเภอ ผู้ชมไลฟ์สดสะสม projected 315,000+ คน
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-20 space-y-20 md:space-y-28">
        <MediaMetricsSection />
        <PackagesSection />
        <EcosystemSection clubs={clubs} />
        <OfficialPartnersSection />
        <FinalCtaSection />
      </div>
    </main>
  );
}
