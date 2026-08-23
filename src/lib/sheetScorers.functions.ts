import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1q8DxrFqrB9FttC4bdOdS0sxcktO21dMMmTnUu8RndBs";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

export type SheetScorer = { name: string; minute: number | null; ownGoal: boolean };
export type SheetMatchScorers = {
  date: string;
  home_team: string;
  away_team: string;
  matchweek: number | null;
  home: SheetScorer[];
  away: SheetScorer[];
};

const NO_SCORER = "(ไม่มีผู้ทำประตู)";

function parseScorers(cell: string | undefined): SheetScorer[] {
  if (!cell) return [];
  const trimmed = cell.trim();
  if (!trimmed || trimmed === NO_SCORER) return [];
  return trimmed
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const minuteMatch = entry.match(/\((\d+)'\)/);
      const minute = minuteMatch ? parseInt(minuteMatch[1], 10) : null;
      const ownGoal = /\(OG\)/i.test(entry);
      const name = entry
        .replace(/\(\d+'\)/g, "")
        .replace(/\(OG\)/gi, "")
        .trim();
      return { name, minute, ownGoal };
    });
}

export const fetchSheetScorers = createServerFn({ method: "GET" })
  .inputValidator((isU16: boolean) => isU16)
  .handler(async ({ data: isU16 }): Promise<SheetMatchScorers[]> => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
    if (!sheetsKey) throw new Error("GOOGLE_SHEETS_API_KEY is not configured");

    const range = isU16 ? "match_results_u16!A2:I" : "match_results!A2:I";
    const url = `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values/${range}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Google Sheets fetch failed [${res.status}]: ${body}`);
    }
    const data = (await res.json()) as { values?: string[][] };
    const rows = data.values ?? [];
    return rows.map((r) => ({
      date: r[0] ?? "",
      home_team: r[1] ?? "",
      away_team: r[2] ?? "",
      matchweek: r[7] ? parseInt(r[7], 10) : null,
      home: parseScorers(r[5]),
      away: parseScorers(r[6]),
    }));
  },
);
