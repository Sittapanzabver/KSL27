import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { fetchNewsBySlug, fetchNews } from "@/lib/queries";
import { SITE_URL, SITE_NAME, SITE_YEAR } from "@/lib/site";

export const Route = createFileRoute("/news/$slug")({
  // โหลดบทความฝั่ง server → head (og:*) ส่งออกใน HTML เพื่อให้ Facebook/LINE
  // แสดง preview ถูกต้องตอนแชร์ลิงก์
  loader: async ({ params }) => {
    try {
      return await fetchNewsBySlug(params.slug);
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) => {
    const n = loaderData as any;
    const title = n?.title ? `${n.title} — ${SITE_NAME}` : `ข่าวสาร — ${SITE_NAME}`;
    const desc = n?.excerpt || `ข่าวสาร Korat Super League ${SITE_YEAR}`;
    const image = n?.cover_url || `${SITE_URL}/og-image.png`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: image },
        { property: "og:site_name", content: SITE_NAME },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/news/${params.slug}` }],
    };
  },
  component: NewsDetail,
});

export default function NewsDetail() {
  const n = Route.useLoaderData();
  const { slug } = Route.useParams();
  const [related, setRelated] = useState<any[]>([]);

  // ดึงข่าวที่เกี่ยวข้องฝั่ง client (ไม่จำเป็นต้องรอ SSR)
  useEffect(() => {
    if (!n?.category) {
      setRelated([]);
      return;
    }
    let cancelled = false;
    fetchNews(20)
      .then((all) => {
        if (!cancelled) {
          setRelated(
            all
              .filter((x: any) => x.category === n.category && x.slug !== n.slug)
              .slice(0, 3)
          );
        }
      })
      .catch(() => setRelated([]));
    return () => {
      cancelled = true;
    };
  }, [slug, n]);

  if (!n) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-korat-red mb-4">404</p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
          ไม่พบบทความ
        </h1>
        <p className="text-muted-foreground mb-8">
          บทความที่คุณกำลังหาอาจถูกลบหรือไม่มีอยู่จริง
        </p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 bg-korat-red text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-korat-red/90 transition-colors"
        >
          <ArrowLeft className="size-4" /> กลับไปหน้าข่าวสาร
        </Link>
      </div>
    );
  }

  return (
    <>
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-korat-red transition-colors mb-6"
        >
          <ArrowLeft className="size-4" /> กลับไปหน้าข่าวสาร
        </Link>
        <span className="bg-korat-red text-white text-[10px] font-bold px-2 py-1 mt-2 inline-block uppercase tracking-wider">
          {n.category}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tighter leading-[0.95] mt-3 mb-4">
          {n.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          เผยแพร่ {new Date(n.published_at).toLocaleDateString("th-TH", { dateStyle: "long" })}
        </p>
        <div
          className="aspect-video bg-cover bg-center mb-8 border border-border"
          style={{
            backgroundImage: `url(${n.cover_url || `https://picsum.photos/seed/news-${n.slug}/1200/675`})`,
          }}
        />
        {n.excerpt && (
          <p className="text-base md:text-lg leading-relaxed mb-6 font-medium">{n.excerpt}</p>
        )}
        <div className="prose prose-invert max-w-none text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {n.content}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-card/30">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mb-6">
              ข่าวที่เกี่ยวข้อง
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/news/$slug"
                  params={{ slug: r.slug }}
                  className="group block bg-card border border-border hover:border-korat-red transition-colors overflow-hidden"
                >
                  <div
                    className="aspect-video bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url(${r.cover_url || `https://picsum.photos/seed/news-${r.slug}/600/338`})`,
                    }}
                  />
                  <div className="p-4">
                    <span className="bg-korat-red text-white text-[10px] font-bold px-2 py-1 inline-block uppercase tracking-wider mb-2">
                      {r.category}
                    </span>
                    <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight line-clamp-2">
                      {r.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-korat-red group-hover:gap-2 transition-all">
                      อ่านข่าว <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
