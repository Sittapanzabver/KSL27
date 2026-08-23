import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  tier: string;
}

export function SponsorBanner() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    supabase
      .from("sponsors")
      .select("*")
      .order("tier")
      .then(({ data }) => {
        if (data) setSponsors(data as Sponsor[]);
      });
  }, []);

  const title = sponsors.filter((s) => s.tier === "title");
  const gold = sponsors.filter((s) => s.tier === "gold");
  const silver = sponsors.filter((s) => s.tier === "silver");

  if (sponsors.length === 0) return null;

  return (
    <div className="bg-asphalt border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-bold uppercase text-korat-red tracking-[0.2em] text-center mb-6">
          ผู้สนับสนุนอย่างเป็นทางการ
        </p>

        {/* Title Sponsor */}
        {title.length > 0 && (
          <div className="flex justify-center gap-8 mb-6">
            {title.map((s) => (
              <a key={s.id} href={s.website ?? "#"} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2">
                <div className="border-2 border-korat-red p-3 bg-white/5 group-hover:bg-white/10 transition-colors">
                  <img src={s.logo_url ?? ""} alt={s.name}
                    className="h-16 w-auto object-contain filter brightness-0 invert" />
                </div>
                <span className="text-[9px] tracking-widest uppercase text-korat-red font-bold">
                  Title Sponsor
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Gold Sponsors */}
        {gold.length > 0 && (
          <div className="flex justify-center flex-wrap gap-6 mb-4">
            {gold.map((s) => (
              <a key={s.id} href={s.website ?? "#"} target="_blank" rel="noopener noreferrer"
                className="group border border-yellow-600/40 p-2 bg-white/5 hover:bg-white/10 transition-colors">
                <img src={s.logo_url ?? ""} alt={s.name}
                  className="h-10 w-auto object-contain filter brightness-0 invert" />
              </a>
            ))}
          </div>
        )}

        {/* Silver Sponsors */}
        {silver.length > 0 && (
          <div className="flex justify-center flex-wrap gap-4">
            {silver.map((s) => (
              <a key={s.id} href={s.website ?? "#"} target="_blank" rel="noopener noreferrer"
                className="group border border-border p-2 bg-white/5 hover:bg-white/10 transition-colors">
                <img src={s.logo_url ?? ""} alt={s.name}
                  className="h-7 w-auto object-contain filter brightness-0 invert opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
