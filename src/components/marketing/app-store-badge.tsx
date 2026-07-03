import { AppleGlyph } from "./glyphs";

/**
 * Official-style App Store badge. Update APP_STORE_URL once the app has its
 * real listing; until then it points at the App Store search for PlayStudy.
 */
export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ??
  "https://apps.apple.com/us/app/playstudy";

export function AppStoreBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-xl bg-zinc-950 px-4 py-2.5 text-white shadow-md ring-1 ring-white/15 transition-transform hover:scale-[1.03] dark:bg-black ${className}`}
    >
      <AppleGlyph className="h-6 w-6" />
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-medium opacity-80">
          Download on the
        </span>
        <span className="-mt-0.5 block text-base font-semibold">App Store</span>
      </span>
    </a>
  );
}
