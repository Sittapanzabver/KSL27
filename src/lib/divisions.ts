export const DIVISIONS = {
  SUPER_LEAGUE: {
    id: "bd770ed0-2027-47e0-ab34-901a151e9f7c",
    label: "ประชาชน",
    labelEn: "SUPER LEAGUE",
  },
  U16: {
    id: "11111111-2027-4016-8000-000000000016",
    label: "U-16",
    labelEn: "UNDER 16",
  },
} as const;

export type DivisionKey = keyof typeof DIVISIONS;
