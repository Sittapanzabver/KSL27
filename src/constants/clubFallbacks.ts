export type ClubLite = {
  slug: string;
  name: string;
  short_name: string;
  primary_color?: string | null;
  logo_url?: string | null;
};

export const CLUB_FALLBACKS: Record<string, ClubLite> = {
  "soengsang-united": {
    slug: "soengsang-united",
    name: "เสิงสาง ยูไนเต็ด",
    short_name: "SUTD",
  },
  "nondaeng-fc": {
    slug: "nondaeng-fc",
    name: "โนนแดง เอฟซี",
    short_name: "NDFC",
  },
  "phimai-fc": {
    slug: "phimai-fc",
    name: "พิมาย เอฟซี",
    short_name: "PMFC",
  },
  "pakthongchai-united": {
    slug: "pakthongchai-united",
    name: "ปักธงชัย ยูไนเต็ด",
    short_name: "PUTD",
  },
  "khonburi-fc": {
    slug: "khonburi-fc",
    name: "ครบุรี เอฟซี",
    short_name: "KBFC",
  },
  "suranaree-fc": {
    slug: "suranaree-fc",
    name: "สุรนารี เอฟซี",
    short_name: "SNFC",
  },
  "union-korat": {
    slug: "union-korat",
    name: "ยูเนี่ยน โคราช",
    short_name: "UNKR",
  },
  "khamsakaesaeng-fc": {
    slug: "khamsakaesaeng-fc",
    name: "ขามสะแกแสง เอฟซี",
    short_name: "KSFC",
  },
};
