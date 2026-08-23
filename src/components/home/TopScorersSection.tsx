import { TopScorers } from "@/components/site/TopScorers";

export function TopScorersSection() {
  return (
    <section>
      <TopScorers limit={10} />
    </section>
  );
}
