import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { NewsTicker } from "@/components/site/NewsTicker";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/lib/i18n";
import { SITE_URL, SITE_NAME, SITE_DESC } from "@/lib/site";

import appCss from "../styles.css?url";

// รูป share เต็ม 1200×630 (สร้างด้วย scripts/generate-og-image.mjs)
const OG_IMAGE = `${SITE_URL}/og-image.png`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-display font-extrabold text-korat-red">404</h1>
        <h2 className="mt-4 text-2xl font-display font-extrabold">ไม่พบหน้าที่คุณค้นหา</h2>
        <p className="mt-2 text-sm text-muted-foreground">หน้าเว็บที่คุณกำลังหาอาจถูกย้ายหรือไม่มีอยู่แล้ว</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-korat-red px-6 py-3 text-sm font-bold text-white uppercase tracking-wider hover:bg-korat-red-deep"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      { name: "description", content: SITE_DESC },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: SITE_DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_NAME },
      { name: "twitter:description", content: SITE_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,800&family=Sarabun:wght@300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <NewsTicker />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
        </div>
      </I18nProvider>
    </QueryClientProvider>
  );
}
