import { TimeLeft } from "../../hooks/useAuctionTimer";

interface CountdownDisplayProps {
  timeLeft: TimeLeft;
  isExpired?: boolean;
  variant?: "hero" | "section" | "compact";
  size?: "default" | "large";
  className?: string;
}

const SEGMENTS = [
  { key: "days" as const, label: "يوم", pad: false },
  { key: "hours" as const, label: "ساعة", pad: true },
  { key: "minutes" as const, label: "دقيقة", pad: true },
  { key: "seconds" as const, label: "ثانية", pad: true },
];

function formatValue(value: number, pad: boolean) {
  return pad ? String(value).padStart(2, "0") : String(value);
}

function CountdownDisplay({
  timeLeft,
  isExpired = false,
  variant = "section",
  size = "default",
  className = "",
}: CountdownDisplayProps) {
  if (isExpired) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-500 type-body font-semibold ${className}`}
      >
        انتهى المزاد
      </div>
    );
  }

  const isHero = variant === "hero";
  const isCompact = variant === "compact";
  const isLarge = size === "large";

  const numberClass = isCompact
    ? "text-xl sm:text-2xl text-[#DC2626]"
    : isLarge
      ? "text-4xl sm:text-5xl lg:text-[56px] text-[#DC2626]"
      : isHero
        ? "type-display text-white"
        : "text-3xl sm:text-4xl text-[#DC2626]";

  const labelClass = isCompact
    ? "text-[#DC2626]/75"
    : isLarge
      ? "text-[#991B1B]/80"
      : isHero
        ? "text-white/75"
        : "text-[#991B1B]/70";

  const cellClass = isCompact
    ? "px-3 py-2"
    : isLarge
      ? "px-4 sm:px-5 py-3 sm:py-4"
      : "px-3 sm:px-4 py-2.5 sm:py-3";

  const segmentGap = isLarge ? "gap-2" : "gap-1.5";

  const dividerClass = isHero
    ? "h-10 sm:h-12 bg-white/25"
    : isCompact
      ? "h-6 bg-[#DC2626]/20"
      : isLarge
        ? "h-12 sm:h-16 bg-[#FECACA]"
        : "h-9 sm:h-11 bg-[#FECACA]";

  const boxClass = isHero
    ? "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2"
    : isCompact
      ? "bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-1.5"
      : isLarge
        ? "bg-white border-2 border-[#FECACA] rounded-2xl shadow-[0_8px_32px_rgba(220,38,38,0.12)] p-2 sm:p-3"
        : "bg-white border border-[#FECACA] rounded-xl shadow-sm p-1.5 sm:p-2";

  const labelSize = isLarge ? "type-small font-semibold" : "type-caption font-medium";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {!isCompact && (
        <p
          className={`font-semibold mb-3 flex items-center gap-2 ${
            isLarge ? "type-body" : "type-small"
          } ${isHero ? "text-white/90" : "text-[#374151]"}`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DC2626]" />
          </span>
          ينتهي المزاد خلال
        </p>
      )}

      <div className={`inline-flex items-stretch ${boxClass}`}>
        {SEGMENTS.map((seg, index) => (
          <div key={seg.key} className="flex items-stretch">
            <div className={`flex items-baseline justify-center ${segmentGap} ${cellClass}`}>
              <span className={`font-extrabold tabular-nums leading-none ${numberClass}`}>
                {formatValue(timeLeft[seg.key], seg.pad)}
              </span>
              <span className={`${labelSize} ${labelClass}`}>
                {seg.label}
              </span>
            </div>

            {index < SEGMENTS.length - 1 && (
              <div className={`w-px self-center ${dividerClass}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountdownDisplay;
