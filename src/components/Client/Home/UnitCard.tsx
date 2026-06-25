import { Link } from "react-router-dom";
import { ChevronLeft, Maximize2 } from "lucide-react";
import { AuctionUnit } from "../../../services/bidderUnits";
import closedImage from "../../../assets/bd851cc411d2c505e60c380df87d198b50cc5b1c.png";

interface UnitCardProps {
  unit: AuctionUnit;
  isExpired: boolean;
  auction?: boolean;
}

function UnitCard({ unit, isExpired, auction }: UnitCardProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US").format(Math.round(amount));

  const areaNum = parseFloat(String(unit.area).replace(/[^\d.]/g, "")) || 0;
  const totalPrice = unit.starting_price_per_meter * areaNum;

  const receiveLabel =
    unit.recieve_duration === 0 || String(unit.recieve_duration) === "0"
      ? "استلام فوري"
      : String(unit.recieve_duration);

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-[#E6EDEA] overflow-hidden hover:shadow-lg hover:border-[#C5D5CC] transition-all duration-300">
      {unit.closed && (
        <>
          <img
            src={closedImage}
            alt="مباعة"
            className="absolute top-1/2 left-1/2 z-30 w-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          />
          <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px]" />
        </>
      )}

      <h3 className={`type-subheading text-[#1a3329] text-center px-4 pt-4 pb-2 line-clamp-2 ${unit.closed ? "opacity-60" : ""}`}>
        {unit.unit_number}
      </h3>

      <div className="relative aspect-[4/3] bg-[#F0F4F2] overflow-hidden">
        <img
          src={unit.image}
          alt={unit.unit_number}
          className="w-full h-full object-contain p-3 group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      <div className={`flex flex-col flex-1 p-5 pt-4 gap-4 ${unit.closed ? "opacity-60" : ""}`}>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-[#F4F7F5] rounded-xl py-3 px-2">
            <p className="type-small text-[#6B7280] mb-1">المساحة</p>
            <p className="type-body font-bold text-[#285240]">{areaNum} م²</p>
          </div>
          <div className="bg-[#F4F7F5] rounded-xl py-3 px-2">
            <p className="type-small text-[#6B7280] mb-1">سعر المتر</p>
            <p className="type-body font-bold text-[#285240]">
              {formatCurrency(unit.starting_price_per_meter)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between type-small text-[#6B7280] px-1">
          <span>
            إجمالي:{" "}
            <strong className="type-body font-bold text-[#285240]">
              {formatCurrency(totalPrice)} ج
            </strong>
          </span>
          <span className="text-end max-w-[48%]">{receiveLabel}</span>
        </div>

        {isExpired && (
          <p className="text-center type-caption text-red-500 font-medium">انتهى المزاد</p>
        )}

        {!isExpired && (
          <div className="mt-auto flex flex-col gap-2.5">
            <Link to={`/units/${unit.id}`}>
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-[#285240] text-white type-body font-semibold hover:bg-[#1e3d30] transition-colors"
              >
                ابدأ المزاد
              </button>
            </Link>
            <Link to={auction ? `/units/${unit.id}` : "/auction"}>
              <button
                type="button"
                className="w-full h-10 rounded-xl border border-[#D5E0DA] text-[#285240] type-body font-semibold hover:bg-[#F4F7F5] transition-colors flex items-center justify-center gap-1.5"
              >
                {auction ? (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    التفاصيل
                  </>
                ) : (
                  <>
                    عرض المشروع
                    <ChevronLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitCard;
