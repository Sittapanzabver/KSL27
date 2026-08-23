import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { fetchNews } from "@/lib/queries";

export function NewsTicker() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchNews(5).then(setItems).catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  // Duplicate the list so the CSS -50% translate creates a seamless loop
  const loop = [...items, ...items];

  return (
    <div className="bg-korat-red-deep text-white border-y border-black/20 overflow-hidden">
      <div className="max-w-[1800px] mx-auto flex items-stretch">
        <div className="shrink-0 bg-korat-red px-4 py-2 flex items-center gap-2 font-display font-bold uppercase tracking-widest text-xs sm:text-sm">
          <span aria-hidden>📰</span>
          <span>ข่าวสาร</span>
        </div>
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="ticker-track text-sm font-medium">
            {loop.map((n, i) => (
              <Link
                key={`${n.id}-${i}`}
                to="/news/$slug"
                params={{ slug: n.slug }}
                className="hover:text-korat-gold transition-colors"
              >
                <span className="text-korat-gold font-bold mr-2">●</span>
                {n.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
