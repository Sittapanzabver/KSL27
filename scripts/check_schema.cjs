// ทดสอบ fetchActiveSeasonClubs แบบ query จริงกับ DB (จำลอง .not slug in (...))
const fs = require("fs");
const env = fs.readFileSync("C:/Users/User/Desktop/AI_BOS/CSDP/ksl-hub/.env", "utf8");
const url = env.match(/SUPABASE_URL\s*=\s*"?([^"\n]+)"?/)[1];
const key = env.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*"?([^"\n]+)"?/)[1];
const h = { apikey: key, Authorization: "Bearer " + key };

(async () => {
  const q = url + "/rest/v1/clubs?select=slug,name&slug=not.in.(phimai-fc)&order=name";
  const r = await fetch(q, { headers: h });
  const d = await r.json();
  if (!Array.isArray(d)) {
    console.log("FAIL:", JSON.stringify(d).slice(0, 200));
    return;
  }
  console.log("fetchActiveSeasonClubs จะได้:", d.length, "ทีม");
  d.forEach((c) => console.log(" -", c.name));
  console.log("\nพิมายอยู่ในผลลัพธ์:", d.some((c) => c.slug === "phimai-fc"));
})().catch((e) => console.error("ERR", e.message));
