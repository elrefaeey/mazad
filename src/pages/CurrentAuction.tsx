import { Button } from "../components/ui/button";
import { AuctionUnit } from "../services/bidderUnits";
import { useAuctionTimer } from "../hooks/useAuctionTimer";
import { useAuctionData } from "../hooks/useAuctionData";
import { BiErrorAlt } from "react-icons/bi";
import { MapPin, Building2, Gavel } from "lucide-react";
import UnitCard from "../components/Client/Home/UnitCard";
import AuctionCountdownBar from "../components/Client/AuctionCountdownBar";
import { Navigate } from "react-router-dom";

function CurrentAuction() {
  const { auctionData, loading, error, refetch } = useAuctionData();
  const { timeLeft, isExpired } = useAuctionTimer(
    auctionData?.data?.auction?.endDate || null
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#285240] border-t-transparent" />
      </div>
    );
  }

  if (!auctionData?.hasActiveAuction) {
    return <Navigate to="/home" replace />;
  }

  const auction = auctionData.data.auction;
  const units = auctionData.data.units;
  const unitsCount = units.length;

  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-12">
      <div className="container pt-6 sm:pt-8">
        {error ? (
          <div className="text-center py-14 bg-white rounded-2xl shadow-sm">
            <BiErrorAlt className="text-4xl mb-3 mx-auto text-[#285240]" />
            <p className="type-body text-red-600 font-semibold mb-4">{error}</p>
            <Button onClick={refetch} className="bg-[#285240] text-white type-body">
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <>
            <article className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_4px_40px_rgba(40,82,64,0.08)] overflow-hidden border border-[#E6EDEA]">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-[#E8EDEA]">
                <img
                  src={auction.image}
                  alt={auction.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-7 space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="type-caption font-semibold text-[#285240] bg-[#E8F5EE] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      مزاد نشط
                    </span>
                    <span className="type-caption text-[#6B7280] bg-[#F4F7F5] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      {unitsCount} {unitsCount === 1 ? "وحدة" : "وحدات"}
                    </span>
                    <span className="type-caption text-[#6B7280] bg-[#F4F7F5] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <Gavel className="w-3.5 h-3.5" />
                      مزاد إلكتروني
                    </span>
                  </div>

                  <h1 className="type-heading text-[#1a3329]">{auction.name}</h1>

                  {auction.address && (
                    <p className="type-small text-[#5C6B64] flex items-start gap-2">
                      <MapPin className="w-4 h-4 shrink-0 text-[#285240] mt-0.5" />
                      {auction.address}
                    </p>
                  )}
                </div>

                <AuctionCountdownBar timeLeft={timeLeft} isExpired={isExpired} />

                {auction.description && (
                  <div className="pt-1 border-t border-[#EEF2F0]">
                    <h2 className="type-small font-semibold text-[#285240] mb-2">
                      عن المشروع
                    </h2>
                    <p className="type-body text-[#5C6B64] text-justify whitespace-pre-line">
                      {auction.description}
                    </p>
                  </div>
                )}
              </div>
            </article>

            <section className="mt-8 sm:mt-10">
              <div className="mb-5 px-1">
                <h2 className="type-heading text-[#1a3329]">الوحدات المتاحة</h2>
                <p className="type-small text-[#6B7280] mt-1">
                  اختر الوحدة وابدأ المزايدة
                </p>
              </div>

              {unitsCount > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                  {units.map((unit: AuctionUnit) => (
                    <UnitCard
                      key={unit.id}
                      unit={unit}
                      isExpired={isExpired}
                      auction
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E6EDEA]">
                  <p className="type-body text-gray-600">لا توجد وحدات متاحة حالياً</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default CurrentAuction;
