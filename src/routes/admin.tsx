import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { syncNewsFromSheets } from "@/lib/syncNews.functions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const sync = useServerFn(syncNewsFromSheets);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await sync();
      setResult(
        `อัปเดตสำเร็จ: ${res.upserted} แถว · ข้าม: ${res.skipped}${
          res.message ? ` · ${res.message}` : ""
        }`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">
            แผงควบคุมแอดมิน
          </h1>
          <p className="text-sm text-muted-foreground">
            จัดการเนื้อหาข่าวผ่าน Google Sheets
          </p>
        </header>

        <section className="border border-border bg-card p-6 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold uppercase">
              ซิงค์ข่าวจาก Google Sheets
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              ดึงข้อมูลจาก sheet ชื่อ <code className="text-korat-gold">news</code>{" "}
              แล้ว upsert เข้าตาราง <code className="text-korat-gold">news</code>{" "}
              โดยใช้ <code>slug</code> เป็น unique key
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={loading}
            className="bg-korat-red text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-korat-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "กำลังซิงค์..." : "Sync from Sheets"}
          </button>

          {result && (
            <div className="border border-green-600/40 bg-green-600/10 text-green-400 px-4 py-3 text-sm">
              ✓ {result}
            </div>
          )}
          {error && (
            <div className="border border-red-600/40 bg-red-600/10 text-red-400 px-4 py-3 text-sm">
              ✗ {error}
            </div>
          )}

          <div className="text-xs text-muted-foreground border-t border-border pt-4">
            <p className="font-bold uppercase mb-1">คอลัมน์ที่ต้องมีใน sheet:</p>
            <p>slug, title, excerpt, content, cover_url, category, published_at, is_published</p>
          </div>
        </section>
      </div>
    </main>
  );
}
