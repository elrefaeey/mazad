interface AdvancePercentageSelectorProps {
  advancePercentage: string;
  setAdvancePercentage: (value: string) => void;
  advances: {
    value: number;
    price_per_meter: number;
    payment_duration: string;
    selected?: boolean;
    _id: string;
  }[];
  isClosed: boolean;
  minAllowedValue: number;
}

export function AdvancePercentageSelector({
  advancePercentage,
  setAdvancePercentage,
  advances,
  isClosed,
  minAllowedValue,
}: AdvancePercentageSelectorProps) {
  const currentIndex = advances.findIndex(
    (val) => Number(advancePercentage) === val.value,
  );
  const isAtMaxValue = currentIndex === advances.length - 1;

  const handleIncrease = () => {
    if (currentIndex < advances.length - 1) {
      setAdvancePercentage(advances[currentIndex + 1].value.toString());
    }
  };

  const handleDecrease = () => {
    if (currentIndex > 0) {
      setAdvancePercentage(advances[currentIndex - 1].value.toString());
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6EDEA] p-4">
      <p className="type-small font-semibold text-[#1a3329] text-center mb-3">
        زايد على المقدم للحصول على أفضل سعر
      </p>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={isClosed || Number(advancePercentage) <= minAllowedValue}
          onClick={handleDecrease}
          className="w-10 h-10 rounded-xl bg-[#285240] text-white text-xl font-bold hover:bg-[#1e3d30] transition-colors disabled:opacity-30 disabled:bg-[#9CA3AF] disabled:cursor-not-allowed"
        >
          −
        </button>

        <div className="min-w-[72px] text-center bg-[#F4F7F5] rounded-xl py-2 px-3">
          <p className="text-2xl font-bold text-[#285240] tabular-nums">
            {advancePercentage}%
          </p>
          <p className="type-caption text-[#6B7280]">نسبة المقدم</p>
        </div>

        <button
          type="button"
          disabled={isClosed || isAtMaxValue}
          onClick={handleIncrease}
          className="w-10 h-10 rounded-xl bg-[#285240] text-white text-xl font-bold hover:bg-[#1e3d30] transition-colors disabled:opacity-30 disabled:bg-[#9CA3AF] disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
