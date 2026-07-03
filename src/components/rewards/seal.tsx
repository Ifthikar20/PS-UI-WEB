/**
 * Hand-drawn certificate seal: a scalloped rosette with ribbon tails, in the
 * same outlined "sticker" style as the doodle icons. `className` sets the
 * accent via text color (stroke follows currentColor).
 */
export function CertificateSeal({
  className,
  earned = true,
}: {
  className?: string;
  earned?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ribbon tails */}
      <path
        d="M22 48 L16 74 L26 67 L32 76 L34 52"
        fill={earned ? "currentColor" : "none"}
        fillOpacity={earned ? 0.18 : 0}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M42 48 L48 74 L38 67 L33 75"
        fill={earned ? "currentColor" : "none"}
        fillOpacity={earned ? 0.18 : 0}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* scalloped rosette */}
      <path
        d="M32 4
           l4.6 3.4 5.6-1 2.4 5.2 5.6 1.2-.4 5.7 4.4 3.6-3 4.9 2 5.4-5 2.8-.8 5.6-5.7.4-3.2 4.7-5.3-2-5.3 2-3.2-4.7-5.7-.4-.8-5.6-5-2.8 2-5.4-3-4.9 4.4-3.6-.4-5.7 5.6-1.2 2.4-5.2 5.6 1z"
        fill={earned ? "currentColor" : "none"}
        fillOpacity={earned ? 0.14 : 0}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="30"
        r="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={earned ? undefined : "3 3"}
      />
      {/* star at the center */}
      <path
        d="M32 22.5 l2.4 4.9 5.4.8 -3.9 3.8 .9 5.4 -4.8-2.5 -4.8 2.5 .9-5.4 -3.9-3.8 5.4-.8z"
        fill={earned ? "currentColor" : "none"}
        fillOpacity={earned ? 0.9 : 0}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
