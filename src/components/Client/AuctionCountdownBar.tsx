import { TimeLeft } from "../../hooks/useAuctionTimer";

interface AuctionCountdownBarProps {
  timeLeft: TimeLeft;
  isExpired?: boolean;
}

const SEGMENTS = [
  { key: "days" as const, label: "يوم", pad: false },
  { key: "hours" as const, label: "ساعة", pad: true },
  { key: "minutes" as const, label: "دقيقة", pad: true },
  { key: "seconds" as const, label: "ثانية", pad: true },
];

export function AuctionCountdownBar({
  timeLeft,
  isExpired = false,
}: AuctionCountdownBarProps) {
  if (isExpired) {
    return (
      <div className="rounded-xl bg-gray-100 px-4 py-3 text-center type-small text-gray-500 font-medium">
        انتهى وقت المزاد
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#285240] px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="type-small text-white/90 font-medium flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-red-400" />
        </span>
        ينتهي المزاد خلال
      </div>

      <div className="flex items-center justify-center sm:justify-end divide-x divide-x-reverse divide-white/20">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.key}
            className="flex items-baseline gap-1 px-3 sm:px-4 first:ps-0 last:pe-0"
          >
            <span className="type-heading text-white tabular-nums leading-none">
              {seg.pad
                ? String(timeLeft[seg.key]).padStart(2, "0")
                : String(timeLeft[seg.key])}
            </span>
            <span className="type-caption text-white/65 font-medium">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuctionCountdownBar;
