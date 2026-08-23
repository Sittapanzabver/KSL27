import { createServerFn } from "@tanstack/react-start";

const SPREADSHEET_ID = "1q8DxrFqrB9FttC4bdOdS0sxcktO21dMMmTnUu8RndBs";
const SHEET_RANGE = "news!A1:Z10000";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

type SheetsResponse = {
  range?: string;
  values?: string[][];
};

const REQUIRED_FIELDS = [
  "slug",
  "title",
  "excerpt",
  "content",
  "cover_url",
  "category",
  "published_at",
  "is_published",
] as const;

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes" || v === "y";
}

function parseTimestamp(value: string | undefined): string | null {
  if (!value || !value.trim()) return null;
  const d = new Date(value.trim());
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function nullIfEmpty(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export const syncNewsFromSheets = createServerFn({ method: "POST" }).handler(
  async () => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!lovableKey || !sheetsKey) {
      throw new Error("Missing connector credentials");
    }

    const url = `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Sheets gateway error ${res.status}: ${text}`);
    }

    const json = (await res.json()) as SheetsResponse;
    const rows = json.values ?? [];
    if (rows.length < 2) {
      return { ok: true, upserted: 0, skipped: 0, message: "No data rows" };
    }

    const headers = rows[0].map((h) => h.trim().toLowerCase());
    const idx = (name: string) => headers.indexOf(name);

    const missing = REQUIRED_FIELDS.filter((f) => idx(f) === -1);
    if (missing.length) {
      throw new Error(`Missing required columns in sheet: ${missing.join(", ")}`);
    }

    type NewsRow = {
      slug: string;
      title: string;
      excerpt: string | null;
      content: string | null;
      cover_url: string | null;
      category: string | null;
      published_at: string;
      is_published: boolean;
    };
    const records: NewsRow[] = [];
    let skipped = 0;
    for (const row of rows.slice(1)) {
      const slug = nullIfEmpty(row[idx("slug")]);
      const title = nullIfEmpty(row[idx("title")]);
      if (!slug || !title) {
        skipped++;
        continue;
      }
      records.push({
        slug,
        title,
        excerpt: nullIfEmpty(row[idx("excerpt")]),
        content: nullIfEmpty(row[idx("content")]),
        cover_url: nullIfEmpty(row[idx("cover_url")]),
        category: nullIfEmpty(row[idx("category")]),
        published_at: parseTimestamp(row[idx("published_at")]) ?? new Date().toISOString(),
        is_published: parseBoolean(row[idx("is_published")]),
      });
    }

    if (!records.length) {
      return { ok: true, upserted: 0, skipped, message: "No valid rows" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("news")
      .upsert(records, { onConflict: "slug" });

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    return { ok: true, upserted: records.length, skipped };
  },
);
