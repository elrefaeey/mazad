import HeroImage from "../../../assets/hero-section.svg";
import { Button } from "../../ui/button";
import { useAuctionData } from "../../../hooks/useAuctionData";
import { useAuctionTimer } from "../../../hooks/useAuctionTimer";
import CountdownDisplay from "../CountdownDisplay";

function HeroSection() {
  const { auctionData } = useAuctionData();
  const endDate = auctionData?.hasActiveAuction
    ? auctionData.data.auction.endDate
    : null;
  const { timeLeft, isExpired } = useAuctionTimer(endDate);

  const handleScroll = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showTimer = auctionData?.hasActiveAuction && !isExpired;

  return (
    <section className="bg-[#F4F7F5] overflow-hidden">
      <div className="container py-10 sm:py-14 lg:py-20">
        <div className="grid gap-8 lg:gap-14 w-full lg:grid-cols-2 items-center">
          <div className="flex flex-col gap-5 justify-center text-right order-2 lg:order-1">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[1.15] text-[#06372D]">
              اشتري وحدتك بأفضل سعر عبر{" "}
              <span className="text-[#285240]">المزايدة الذكية</span> على نسبة
              المقدم
            </h1>

            <p className="type-body sm:text-lg text-[#4B5563] max-w-xl leading-relaxed">
              زايد على نسبة المقدم للحصول على سعر متر أقل — نظام شفاف ومباشر
              للمستثمرين
            </p>

            {showTimer && (
              <CountdownDisplay
                timeLeft={timeLeft}
                isExpired={isExpired}
                variant="section"
                size="large"
                className="items-start lg:items-start"
              />
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-1">
              <Button
                onClick={() => handleScroll("auction-section")}
                className="text-white w-full sm:w-auto px-10 sm:px-14 rounded-xl py-3.5 sm:py-4 type-body font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                ابدأ المزايدة الآن
              </Button>

              <Button
                onClick={() => handleScroll("how-section")}
                className="text-white bg-[#6B867A] hover:bg-[#5a7569] w-full sm:w-auto px-10 rounded-xl py-3.5 sm:py-4 type-body font-medium"
              >
                شاهد كيف تعمل
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center w-full order-1 lg:order-2">
            <div className="relative w-full max-w-[560px]">
              <div className="absolute -inset-3 bg-[#285240]/5 rounded-3xl blur-2xl" />
              <img
                src={HeroImage}
                alt="مزاد عقاري"
                className="relative w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
