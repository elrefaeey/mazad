import { useState } from "react";
import { UnitDetails } from "../../types/bidding";

function UnitInfoSection({ unit }: { unit: UnitDetails }) {
  const [image, setImage] = useState<"unit" | "location">("unit");

  return (
    <div className="bg-white rounded-2xl border border-[#E6EDEA] overflow-hidden w-full">
      <div className="px-5 pt-5 pb-3 border-b border-[#E6EDEA]">
        <p className="type-caption text-[#6B7280] mb-1">معلومات الوحدة</p>
        <h1 className="type-heading text-[#1a3329]">{unit.unit_number}</h1>
      </div>

      <div className="p-5">
        <div className="flex rounded-xl bg-[#F4F7F5] p-1 mb-4">
          <button
            type="button"
            onClick={() => setImage("unit")}
            className={`flex-1 py-2 rounded-lg type-small font-semibold transition-colors ${
              image === "unit"
                ? "bg-white text-[#285240] shadow-sm"
                : "text-[#6B7280] hover:text-[#285240]"
            }`}
          >
            أبعاد الوحدة
          </button>
          <button
            type="button"
            onClick={() => setImage("location")}
            className={`flex-1 py-2 rounded-lg type-small font-semibold transition-colors ${
              image === "location"
                ? "bg-white text-[#285240] shadow-sm"
                : "text-[#6B7280] hover:text-[#285240]"
            }`}
          >
            موقع الوحدة
          </button>
        </div>

        <div className="aspect-[4/3] bg-[#F0F4F2] rounded-xl overflow-hidden mb-5">
          <img
            key={image}
            src={image === "unit" ? unit.mainImage || unit.image : unit.image}
            alt={`وحدة ${unit.unit_number}`}
            className="w-full h-full object-contain p-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#F4F7F5] rounded-xl py-3 px-3 text-center">
            <p className="type-caption text-[#6B7280] mb-1">المساحة</p>
            <p className="type-body font-bold text-[#285240]">{unit.area} م²</p>
          </div>
          <div className="bg-[#F4F7F5] rounded-xl py-3 px-3 text-center">
            <p className="type-caption text-[#6B7280] mb-1">سعر المتر الابتدائي</p>
            <p className="type-body font-bold text-[#285240]">
              {new Intl.NumberFormat("en-US").format(unit.starting_price_per_meter)}
            </p>
          </div>
        </div>

        {unit.specs && (
          <div>
            <h2 className="type-subheading text-[#1a3329] mb-2">مواصفات الوحدة</h2>
            <p className="type-body text-[#5C6B64] leading-relaxed text-justify">
              {unit.specs}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitInfoSection;
