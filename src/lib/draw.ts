// draw.ts — Tournament draw & pairing engine (pure, client-side, deterministic-friendly)
// Used for the "จับฉลาก / จับคู่" tournament generator (2027 preview). No DB writes.

export type Match = { home: string; away: string };
export type Round = Match[];

// Fisher–Yates shuffle (returns a new array; does not mutate input)
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Seeded RNG from a string (so a "draw code" reproduces the same draw)
export function rngFromSeed(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Knockout bracket — requires N as a power of 2 (>=2). Adds "BYE" for padding.
export function knockoutBracket(teamNames: string[]): Round[] {
  const n = teamNames.length;
  if (n < 2) return [];
  // pad up to next power of 2 with BYE
  let size = 1;
  while (size < n) size *= 2;
  const slots: string[] = [...teamNames];
  while (slots.length < size) slots.push("BYE");

  // pair slot[0] vs slot[size-1], slot[1] vs slot[size-2]... (seeded 1v16 style)
  const first: Round = [];
  for (let i = 0; i < size / 2; i++) {
    first.push({ home: slots[i], away: slots[size - 1 - i] });
  }
  const bracket: Round[] = [first];
  let roundSize = size / 2;
  while (roundSize > 1) {
    const r: Round = [];
    for (let i = 0; i < roundSize; i++) {
      r.push({ home: "", away: "" }); // placeholders for later rounds
    }
    bracket.push(r);
    roundSize = roundSize / 2;
  }
  return bracket;
}

// Round-robin (single) — "circle method"; works for odd counts (adds a BYE rotation)
export function roundRobin(teamNames: string[]): Round[] {
  const teams = [...teamNames];
  if (teams.length % 2 === 1) teams.push("BYE");
  const n = teams.length;
  const rounds: Round[] = [];
  const fixed = teams[0];
  let rest = teams.slice(1);
  for (let r = 0; r < n - 1; r++) {
    const round: Match[] = [];
    const list = [fixed, ...rest];
    for (let i = 0; i < n / 2; i++) {
      round.push({ home: list[i], away: list[n - 1 - i] });
    }
    rounds.push(round);
    rest = [rest[rest.length - 1], ...rest.slice(0, rest.length - 1)];
  }
  // filter out matches with BYE (odd team count)
  return rounds.map((rd) => rd.filter((m) => m.home !== "BYE" && m.away !== "BYE"));
}

// Group stage: split teams into `k` groups, round-robin within each group.
// `rng` optional — pass a seeded rng for a reproducible draw; otherwise Math.random.
export function groupDraw(teamNames: string[], groups: number, rng?: () => number): Round[][] {
  if (groups < 1) return [];
  const shuffled = rng ? shuffle(teamNames, rng) : shuffle(teamNames);
  const buckets: string[][] = Array.from({ length: groups }, () => []);
  shuffled.forEach((t, i) => buckets[i % groups].push(t));
  return buckets.map((names) => roundRobin(names));
}

// Build a readable tournament object for display.
export const FORMATS = [
  { id: "knockout", label: "แพ้คัดออก (Knockout)", th: "แพ้คัดออก (Knockout)" },
  { id: "roundrobin", label: "พบกันหมด (Round Robin)", th: "พบกันหมด (Round Robin)" },
  { id: "group", label: "แบ่งกลุ่ม (Group Stage)", th: "แบ่งกลุ่ม (Group Stage)" },
] as const;
export type FormatId = (typeof FORMATS)[number]["id"];
