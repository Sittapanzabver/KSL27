import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { fetchNews } from "@/lib/queries";
import { PageHeader } from "./standings";
import { buildHead, SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () =>
    buildHead(
      "ข่าวสาร",
      `ข่าวสาร บทสัมภาษณ์ ประมวลภาพ และรายงานผลการแข่งขันของ Meinhard Sports Korat Super League ${SITE_YEAR}`,
      "/news"
    ),
});

function NewsPage() {
  const location = useLocation();
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => { fetchNews(50).then(setNews); }, []);

  if (location.pathname !== "/news") {
    return <Outlet />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <PageHeader eyebrow="News & Stories" title="ข่าวสารและเรื่องราว" subtitle={`ติดตามทุกความเคลื่อนไหวของลีกและสโมสรในฤดูกาล ${SITE_YEAR}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-border">
        {news.map((n, i) => (
          <Link key={n.id} to="/news/$slug" params={{ slug: n.slug }} className="group relative aspect-[4/5] bg-asphalt overflow-hidden block cursor-pointer">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${n.cover_url || `https://picsum.photos/seed/news${i + 10}/600/750`})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/50 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <span className="bg-korat-red text-white text-[10px] font-bold px-2 py-1 mb-3 inline-block uppercase tracking-wider">
                {n.category}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-extrabold leading-tight tracking-tight">{n.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{n.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-korat-red group-hover:gap-2 transition-all">
                อ่านข่าว <ArrowRight className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
