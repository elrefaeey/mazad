import { BiErrorAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import { Button } from "../../ui/button";
import { AuctionUnit } from "../../../services/bidderUnits";
import { useAuctionTimer } from "../../../hooks/useAuctionTimer";
import { useAuctionData } from "../../../hooks/useAuctionData";
import UnitCard from "./UnitCard";
import WarnImage from "../../../assets/warning.svg";
import CountdownDisplay from "../CountdownDisplay";

function AuctionSection() {
  const { auctionData, loading, error, refetch } = useAuctionData();
  const { timeLeft, isExpired } = useAuctionTimer(
    auctionData?.hasActiveAuction ? auctionData?.data.auction.endDate : null
  );
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#285240] mx-auto mb-4"></div>
          <p className="type-body text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }
  return (
    <section
      id="auction-section"
      className="bg-white py-8 lg:py-16  overflow-hidden"
    >
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center text-center mb-10 lg:mb-14 gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-[28px] sm:text-[32px] font-bold text-[#285240]">
            {!auctionData?.data?.auction?.name
              ? "المزادات الحالية"
              : auctionData.data.auction.name}
          </h2>
          <p className="type-body sm:text-lg text-[#6B7280] max-w-xl">
            انضم الآن ونافس للحصول على أفضل سعر متر
          </p>

          {auctionData?.hasActiveAuction && !isExpired && (
            <CountdownDisplay
              timeLeft={timeLeft}
              isExpired={isExpired}
              variant="section"
              size="large"
              className="mt-1"
            />
          )}
        </motion.div>

        {error ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BiErrorAlt className="text-6xl mb-4 mx-auto text-[#285240]" />
            <h3 className="type-subheading text-red-600 mb-2">
              خطأ في التحميل
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button
              onClick={refetch}
              className="bg-[#285240] hover:bg-[#1f3e31] text-white"
            >
              إعادة المحاولة
            </Button>
          </motion.div>
        ) : auctionData?.hasActiveAuction ? (
          <>
            {auctionData.data.units.length > 0 ? (
              <motion.div
                className="grid gap-5 sm:gap-6 lg:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4 items-stretch"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {auctionData.data.units.map((unit: AuctionUnit) => (
                  <motion.div
                    key={unit.id}
                    className="h-full"
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <UnitCard unit={unit} isExpired={isExpired} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="type-subheading text-gray-600 mb-2">
                  لا توجد وحدات متاحة
                </h3>
                <p className="text-gray-500">
                  لم يتم إضافة أي وحدات لهذا المزاد بعد
                </p>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            className="text-center py-12 bg-[#DCE3E0] w-full rounded-xl flex items-center justify-center flex-col gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src={WarnImage} alt="no auction active" className="" />
            <h3 className="type-subheading text-[#262626C9]">
              لا يوجد مزاد حاليا!
            </h3>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

export default AuctionSection;
