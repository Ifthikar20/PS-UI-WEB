import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

/** Shared shell for the standalone marketing pages (about, legal, help). */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 pb-24 pt-36 md:pt-40">{children}</main>
      <SiteFooter />
    </div>
  );
}
