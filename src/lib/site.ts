// ค่าคงที่ของเว็บ — จุดเดียวที่ต้องแก้เมื่อย้าย hosting/domain หรือเปลี่ยน season
// (og:image / canonical ต้องเป็น URL เต็มสำหรับ social crawlers)

export const SITE_URL = "https://koratsuperleague.lovable.app";
export const SITE_NAME = "Korat Super League";
export const SITE_YEAR = "2027"; // ← SSOT ปีที่แสดงหลัก (แก้จุดเดียวตอนขึ้น season ใหม่ เช่น 2027)
export const SITE_DESC =
  `ลีกฟุตบอลท้องถิ่นจังหวัดนครราชสีมา ติดตามผลคะแนน โปรแกรมแข่งขัน และข่าวสารของ Korat Super League ${SITE_YEAR}`;

// ผู้พัฒนาเทคโนโลยีแพลตฟอร์ม (แยกจาก League Operator — ตาม Master Brief §2 แยก Platform Owner กับ League Operator)
export const PLATFORM_OWNER = "ASA TEC STUDIO";
export const PLATFORM_OWNER_NOTE = "ผู้พัฒนาเทคโนโลยีแพลตฟอร์ม";

const OG_IMAGE = `${SITE_URL}/og-image.png`;

/** สร้าง head (meta + canonical) สำหรับหน้าเว็บ — แชร์ลิงก์แล้วขึ้น preview ถูกต้อง
 *  @param image URL ของรูป og:image — ถ้าไม่ส่ง ใช้ default (`/og-image.png`) */
export function buildHead(title: string, description: string, path: string, image?: string) {
  const fullTitle = `${title} — ${SITE_NAME} ${SITE_YEAR}`;
  const ogImage = image || OG_IMAGE;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}${path}` }],
  };
}
