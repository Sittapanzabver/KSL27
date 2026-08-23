import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  GENERAL: "bg-asphalt text-concrete",
  INTERVIEW: "bg-korat-gold text-asphalt",
  "MATCH-REPORT": "bg-korat-red text-white",
  MATCH_REPORT: "bg-korat-red text-white",
  GALLERY: "bg-asphalt text-korat-gold border border-korat-gold",
  PREVIEW: "bg-white text-asphalt border-2 border-asphalt",
};

function categoryBadgeClass(category?: string | null) {
  if (!category) return "bg-korat-red text-white";
  const key = category.toUpperCase().replace(/\s+/g, "-");
  return CATEGORY_BADGE_STYLES[key] || "bg-korat-red text-white";
}

function formatNewsDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function readingTime(content?: string | null) {
  if (!content) return "2 นาที";
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} นาที`;
}

function NewsMeta({ n, light = false }: { n: any; light?: boolean }) {
  const color = light ? "text-concrete/70" : "text-asphalt/60";
  return (
    <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest ${color}`}>
      <span>{formatNewsDate(n.published_at)}</span>
      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
      <span>KSL Media</span>
      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
      <span>{readingTime(n.content)}</span>
    </div>
  );
}

function FeaturedNewsCard({ n }: { n: any }) {
  const img = n.cover_url || `https://picsum.photos/seed/news-${n.slug}/1200/800`;
  return (
    <Link
      to="/news/$slug"
      params={{ slug: n.slug }}
      className="lg:col-span-7 group relative block overflow-hidden rounded-lg bg-asphalt aspect-[16/10] lg:aspect-auto lg:min-h-[520px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={img}
          alt={n.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/60 to-transparent" />
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="bg-korat-gold text-asphalt text-[10px] font-extrabold px-2 py-1 uppercase tracking-wider rounded">
          ★ Featured
        </span>
        <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded ${categoryBadgeClass(n.category)}`}>
          {n.category || "News"}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-concrete">
        <NewsMeta n={n} light />
        <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[0.95] tracking-tighter mt-3 mb-3 line-clamp-3 group-hover:text-korat-red transition-colors">
          {n.title}
        </h3>
        {n.excerpt && (
          <p className="text-sm md:text-base text-concrete/80 line-clamp-2 max-w-2xl mb-4">
            {n.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-korat-red group-hover:gap-3 transition-all">
          อ่านข่าว <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

function SecondaryNewsCard({ n }: { n: any }) {
  const img = n.cover_url || `https://picsum.photos/seed/news-${n.slug}/600/400`;
  return (
    <Link
      to="/news/$slug"
      params={{ slug: n.slug }}
      className="group relative block overflow-hidden rounded-lg bg-asphalt aspect-[16/10] lg:aspect-auto lg:flex-1 lg:min-h-[250px]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={img}
          alt={n.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/50 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded ${categoryBadgeClass(n.category)}`}>
          {n.category || "News"}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 text-concrete">
        <NewsMeta n={n} light />
        <h3 className="font-display text-lg md:text-xl font-extrabold leading-tight tracking-tight mt-2 line-clamp-3 group-hover:text-korat-red transition-colors">
          {n.title}
        </h3>
      </div>
    </Link>
  );
}

function TertiaryNewsCard({ n }: { n: any }) {
  const img = n.cover_url || `https://picsum.photos/seed/news-${n.slug}/600/400`;
  return (
    <Link
      to="/news/$slug"
      params={{ slug: n.slug }}
      className="group block bg-white border border-asphalt/10 rounded-lg overflow-hidden lift-on-hover hover:border-korat-red"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-asphalt">
        <img
          src={img}
          alt={n.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded ${categoryBadgeClass(n.category)}`}>
            {n.category || "News"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <NewsMeta n={n} />
        <h3 className="font-display text-base md:text-lg font-extrabold leading-tight tracking-tight mt-2 mb-2 line-clamp-2 text-asphalt group-hover:text-korat-red transition-colors">
          {n.title}
        </h3>
        {n.excerpt && (
          <p className="text-xs text-asphalt/70 line-clamp-2">{n.excerpt}</p>
        )}
      </div>
    </Link>
  );
}

export function NewsSection({ news }: { news: any[] }) {
  const { t } = useI18n();
  if (news.length === 0) return null;

  return (
    <section className="bg-concrete text-asphalt py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-korat-red mb-2">
              News & Stories
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tighter leading-none">
              {t("sec.news")}
            </h2>
          </div>
          <Link
            to="/news"
            className="border-2 border-asphalt px-5 py-2.5 font-bold uppercase text-xs tracking-wide hover:bg-asphalt hover:text-concrete transition-colors flex items-center gap-2"
          >
            {t("sec.viewAllNews")} <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          <FeaturedNewsCard n={news[0]} />

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {news.slice(1, 3).map((n) => (
              <SecondaryNewsCard key={n.id} n={n} />
            ))}
          </div>

          {news.length > 3 && (
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-1">
              {news.slice(3, 6).map((n) => (
                <TertiaryNewsCard key={n.id} n={n} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
