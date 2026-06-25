import { useState } from "react";
import { UnitDetailsResponse } from "../../types/bidding";
import { formatCurrency } from "../../utils/formatPrice";
import UnitTerms from "./UnitTerms";
import { BidCompareBox } from "./BidCompareBox";
import { AdvancePercentageSelector } from "./AdvancePercentageSelector";
import { LoginPromptDialog } from "./LoginPromptDialog";

function BidDetailsSection({
  advancePercentage,
  unitDetails,
  setAdvancePercentage,
  setShowConfirmModal,
  canBid,
  isAuthenticated = true,
  unitId,
}: {
  advancePercentage: string;
  unitDetails: UnitDetailsResponse;
  setAdvancePercentage;
  canBid: boolean;
  setShowConfirmModal;
  isAuthenticated?: boolean;
  unitId?: string;
}) {
  const [modalTerm, setShowModalTerm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {
    unit,
    deposit,
    bidder_participation: participation,
  } = unitDetails.data;

  const getMinAllowedValue = () => {
    const firstUnselectedAdvance = unit.advances.find(
      (advance) => advance.selected === false,
    );
    return firstUnselectedAdvance ? firstUnselectedAdvance.value : 0;
  };

  const getFirstAdvanceValue = () => {
    return unit.advances.length > 0 ? unit.advances[0].value : 0;
  };

  const currentIndex = unit.advances.findIndex(
    (val) => Number(advancePercentage) === val.value,
  );

  const minAllowedValue = getMinAllowedValue();
  const currentAdvance = unit.advances[currentIndex];

  const totalUnitAfter = formatCurrency(
    (currentAdvance?.price_per_meter || 0) * unit.area,
  );
  const totalUnitBefore = formatCurrency(
    unit.starting_price_per_meter * unit.area,
  );
  const hasBidChanged = totalUnitAfter !== totalUnitBefore;

  const handlePlaceBidClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!canBid) return setShowModalTerm(true);
    setShowConfirmModal(true);
  };

  const confirmTermModal = () => {
    setShowModalTerm(false);
    setShowConfirmModal(true);
  };

  const getBidOrdinal = (index: number) => {
    const ordinals = ["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة"];
    return index <= 5 ? ordinals[index - 1] : `الـ ${index}`;
  };

  const infoBoxes = [
    {
      beforeLabel:
        hasBidChanged &&
        formatCurrency(unit.starting_price_per_meter) !==
          formatCurrency(currentAdvance?.price_per_meter || 0)
          ? "قبل المزايدة"
          : "سعر المتر",
      afterLabel:
        hasBidChanged &&
        formatCurrency(unit.starting_price_per_meter) !==
          formatCurrency(currentAdvance?.price_per_meter || 0)
          ? "بعد المزايدة"
          : "سعر المتر",
      beforeValue: formatCurrency(unit.starting_price_per_meter),
      afterValue: hasBidChanged
        ? formatCurrency(currentAdvance?.price_per_meter || 0)
        : undefined,
    },
    {
      beforeLabel:
        hasBidChanged &&
        formatCurrency(
          (unit.starting_price_per_meter * unit.area * getFirstAdvanceValue()) /
            100,
        ) !==
          formatCurrency(
            ((currentAdvance?.value || 0) *
              unit.area *
              (currentAdvance?.price_per_meter || 0)) /
              100,
          )
          ? "قبل المزايدة"
          : "المقدم",
      afterLabel:
        hasBidChanged &&
        formatCurrency(
          (unit.starting_price_per_meter * unit.area * getFirstAdvanceValue()) /
            100,
        ) !==
          formatCurrency(
            ((currentAdvance?.value || 0) *
              unit.area *
              (currentAdvance?.price_per_meter || 0)) /
              100,
          )
          ? "بعد المزايدة"
          : "المقدم",
      beforeValue: formatCurrency(
        (unit.starting_price_per_meter * unit.area * getFirstAdvanceValue()) /
          100,
      ),
      afterValue: hasBidChanged
        ? formatCurrency(
            ((currentAdvance?.value || 0) *
              unit.area *
              (currentAdvance?.price_per_meter || 0)) /
              100,
          )
        : undefined,
    },
    {
      beforeLabel:
        hasBidChanged &&
        unit.advances[0].payment_duration !== currentAdvance?.payment_duration
          ? "قبل المزايدة"
          : "فترة السداد",
      afterLabel:
        hasBidChanged &&
        unit.advances[0].payment_duration !== currentAdvance?.payment_duration
          ? "بعد المزايدة"
          : "فترة السداد",
      beforeValue: unit.advances[0].payment_duration || "",
      afterValue: hasBidChanged ? currentAdvance?.payment_duration : undefined,
    },
    {
      beforeLabel:
        hasBidChanged && totalUnitBefore !== totalUnitAfter
          ? "قبل المزايدة"
          : "إجمالي الوحدة",
      afterLabel:
        hasBidChanged && totalUnitBefore !== totalUnitAfter
          ? "بعد المزايدة"
          : "إجمالي الوحدة",
      beforeValue: totalUnitBefore,
      afterValue: hasBidChanged ? totalUnitAfter : undefined,
    },
  ];

  const bidButtonLabel = !isAuthenticated
    ? "تسجيل الدخول للمزايدة"
    : !deposit?.has_deposit
      ? "دفع التأمين وتأكيد المزايدة"
      : deposit?.can_bid
        ? participation?.is_participating
          ? "تعديل المزايدة"
          : "إرسال العرض"
        : deposit?.payment_status === "pending" ||
            deposit?.payment_status === "processing"
          ? "انتظار تأكيد التأمين"
          : "دفع التأمين وتأكيد المزايدة";

  return (
    <div className="bg-white rounded-2xl border border-[#E6EDEA] w-full flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-[#E6EDEA] text-center bg-white">
        <p className="type-caption text-[#6B7280] mb-1">
          {currentIndex === 0
            ? "سعر الوحدة قبل المزايدة"
            : `بعد المزايدة ${getBidOrdinal(currentIndex)}`}
        </p>
        <p className="text-3xl sm:text-4xl font-bold text-[#285240] tabular-nums">
          {currentIndex === 0 ? totalUnitBefore : totalUnitAfter}
          <span className="type-body font-normal text-[#6B7280] mr-2">ج.م</span>
        </p>
      </div>

      <div className="p-5 flex flex-col gap-3 bg-white">
        <div className="flex flex-col gap-2.5">
          {infoBoxes.map((box, i) => (
            <BidCompareBox key={i} {...box} />
          ))}
        </div>

        <AdvancePercentageSelector
          advancePercentage={advancePercentage}
          setAdvancePercentage={setAdvancePercentage}
          advances={unit.advances}
          isClosed={unit.closed}
          minAllowedValue={minAllowedValue}
        />

        <div className="flex items-center justify-between type-small text-[#6B7280] px-1 py-1">
          <span>فترة الاستلام</span>
          <span className="font-semibold text-[#1a3329]">
            {unit.recieve_duration === "0" ? "استلام فوري" : unit.recieve_duration}
          </span>
        </div>

        {!unit.closed && (
          <button
            type="button"
            onClick={handlePlaceBidClick}
            disabled={
              isAuthenticated && unitDetails.data.bidder_participation?.offers_count == 3
            }
            className="w-full h-12 rounded-xl bg-[#FBCD01] text-[#1a3329] type-body font-bold hover:bg-[#e8be00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {bidButtonLabel}
          </button>
        )}

        {unit.closed && (
          <div className="text-center py-3 rounded-xl bg-red-50 border border-red-100">
            <p className="type-body font-semibold text-red-600">الوحدة مغلقة</p>
          </div>
        )}
      </div>

      <UnitTerms
        setShowConfirmModal={() => setShowModalTerm(false)}
        showTermModal={modalTerm}
        handleConfirmTermModal={confirmTermModal}
      />

      <LoginPromptDialog
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        unitId={unitId}
        auctionId={unit.auction?.toString()}
      />
    </div>
  );
}

export default BidDetailsSection;
