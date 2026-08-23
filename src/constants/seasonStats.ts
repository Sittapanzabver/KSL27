export const SEASON = {
  totalLive: 274433,
  avgLivePerMatch: 19602,
  maxLive: 38100,
  maxLiveMd: "MD10",
  totalStadium: 8757,
  totalRevenue: 240341,
  matches: 14,
  clubs: 8,
};

export const matchData = [
  { md: "MD7", live: 17800, stadium: 620, revenue: 13500 },
  { md: "MD8", live: 12500, stadium: 776, revenue: 17045 },
  { md: "MD9", live: 3500, stadium: 596, revenue: 9730 },
  { md: "MD10", live: 38100, stadium: 440, revenue: 8092 },
  { md: "MD11", live: 11000, stadium: 577, revenue: 6855 },
  { md: "MD12", live: 28600, stadium: 375, revenue: 9100 },
];

export const maxLive = Math.max(...matchData.map((m) => m.live));
