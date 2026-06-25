import { motion, AnimatePresence } from "framer-motion";

type BidCompareBoxProps = {
  beforeLabel: string;
  afterLabel?: string;
  beforeValue: string | number;
  afterValue?: string | number;
};

type BoxVariant = "default" | "before" | "after";

function StackedBox({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string | number;
  variant?: BoxVariant;
}) {
  const widthClass =
    variant === "before"
      ? "flex-[0.65] min-w-0"
      : variant === "after"
        ? "flex-[1.35] min-w-0"
        : "w-full";

  const headerClass =
    variant === "after"
      ? "bg-[#285240] text-white"
      : variant === "before"
        ? "bg-[#F3F4F6] text-[#9CA3AF]"
        : "bg-[#F4F7F5] text-[#6B7280]";

  const valueClass =
    variant === "after"
      ? "bg-white text-[#285240]"
      : variant === "before"
        ? "bg-[#FAFAFA] text-[#9CA3AF] line-through"
        : "bg-white text-[#1a3329]";

  const borderClass =
    variant === "after"
      ? "border-[#285240]/30 shadow-sm"
      : variant === "before"
        ? "border-[#E5E7EB]"
        : "border-[#E6EDEA]";

  return (
    <div className={`flex flex-col rounded-xl overflow-hidden border ${borderClass} ${widthClass}`}>
      <div className={`text-center py-2 type-small font-medium ${headerClass}`}>
        {label}
      </div>
      <div className={`text-center py-2.5 type-body font-bold tabular-nums ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

export function BidCompareBox({
  beforeLabel,
  afterLabel,
  beforeValue,
  afterValue,
}: BidCompareBoxProps) {
  const hasAfter = afterValue !== undefined && afterValue !== beforeValue;
  const label = afterLabel || beforeLabel;

  if (!hasAfter) {
    return <StackedBox label={label} value={beforeValue} variant="default" />;
  }

  return (
    <motion.div layout className="flex gap-2 items-stretch w-full">
      <StackedBox label={beforeLabel} value={beforeValue} variant="before" />
      <AnimatePresence mode="wait">
        <motion.div
          key={String(afterValue)}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="flex-[1.35] min-w-0"
        >
          <StackedBox label={afterLabel!} value={afterValue!} variant="after" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
