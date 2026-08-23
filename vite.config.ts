// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// 2027 — deploy ขึ้น Vercel (คำสั่งเจ้าของ override R-01/R-03, ลบ Vercel เก่า + ตั้งใหม่)
// เปลี่ยน nitro preset จาก default cloudflare-module → vercel
export default defineConfig({
  nitro: { preset: "vercel" },
});
