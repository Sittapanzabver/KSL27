import { createFileRoute } from "@tanstack/react-router";
import { TopScorers } from "@/components/site/TopScorers";
import { PageHeader } from "./standings";
import { SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/players")({
  component: PlayersPage,
  head: () => ({
    meta: [
      { title: `นักเตะดาวซัลโว — Korat Super League ${SITE_YEAR}` },
      { name: "description", content: `อันดับดาวซัลโวและนักเตะยอดเยี่ยมของลีก Korat Super League ${SITE_YEAR} ทั้งชุดใหญ่และ U-16` },
    ],
  }),
});

function PlayersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <PageHeader
        eyebrow="Top Scorers"
        title="ดาวซัลโวประจำลีก"
        subtitle={`อันดับนักเตะที่ยิงประตูได้มากที่สุดในศึก Korat Super League ${SITE_YEAR} — เลือกดูระหว่างชุดใหญ่และ U-16`}
      />
      <TopScorers limit={25} showHeader={false} />
    </div>
  );
}
