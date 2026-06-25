import { UnitDetailsResponse } from "src/types/bidding";
import { LiveBidder } from "../../types/bidders";

interface BiddersListProps {
  isSocketConnected: boolean;
  liveTopBidders: LiveBidder[];
  bidder?: { id: string };
  unitDetails: UnitDetailsResponse;
}

function BiddersList({
  isSocketConnected,
  liveTopBidders,
  bidder,
  unitDetails,
}: BiddersListProps) {
  const { bidder_participation: participation, top_bidders: topBidders } =
    unitDetails.data;
  const bidders = liveTopBidders.length > 0 ? liveTopBidders : topBidders;

  const getCurrentUserRank = () => {
    if (!unitDetails) return null;

    const currentBidderId = bidder?.id || localStorage.getItem("bidderId");
    if (!currentBidderId || !participation?.is_participating) return null;

    const biddersList = liveTopBidders.length > 0 ? liveTopBidders : topBidders;
    if (!biddersList) return null;

    const currentUserIndex = biddersList.findIndex(
      (b) => b.bidder_id === currentBidderId,
    );
    if (currentUserIndex === -1) return null;

    return {
      rank: currentUserIndex + 1,
      total: biddersList.length,
    };
  };

  const userRank = getCurrentUserRank();

  return (
    <div className="bg-white rounded-2xl border border-[#E6EDEA] w-full overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6EDEA]">
        <h2 className="type-subheading text-[#1a3329]">قائمة المزايدين</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isSocketConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="type-caption text-[#6B7280]">
            {isSocketConnected ? "متصل مباشرة" : "غير متصل"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#285240] text-white type-small">
              <th className="text-right font-semibold py-3 px-5">الاسم</th>
              <th className="text-center font-semibold py-3 px-4">المقدم</th>
              <th className="text-left font-semibold py-3 px-5">فترة السداد</th>
            </tr>
          </thead>
          <tbody>
            {bidders && bidders.length > 0 ? (
              bidders.map((bidder_item, index) => {
                const currentBidderId =
                  bidder?.id || localStorage.getItem("bidderId");

                const isCurrentUser =
                  participation?.is_participating &&
                  (currentBidderId === bidder_item.bidder_id ||
                    (participation.bid_details &&
                      participation.bid_details.advance_value ===
                        bidder_item.advance_value &&
                      participation.bid_details.price_per_meter ===
                        bidder_item.price_per_meter &&
                      Math.abs(
                        new Date(participation.bid_details.bid_time).getTime() -
                          new Date(bidder_item.bid_time).getTime(),
                      ) < 1000));

                return (
                  <tr
                    key={`${bidder_item.bidder_id}-${index}`}
                    className={`border-b border-[#E6EDEA] last:border-0 type-body ${
                      isCurrentUser ? "bg-[#E8F5EE]" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-5 text-right font-medium text-[#1a3329]">
                      {isCurrentUser
                        ? "أنت"
                        : bidder_item.bidder_name.split(" ")[0] ||
                          `مزايد ${index + 1}`}
                    </td>
                    <td className="py-3 px-4 text-center text-[#285240] font-semibold">
                      {bidder_item.advance_value}%
                    </td>
                    <td className="py-3 px-5 text-left text-[#5C6B64]">
                      {bidder_item.payment_duration}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center type-body text-[#6B7280]">
                  لا توجد مزايدات حتى الآن — كن أول من يزايد!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 bg-[#F4F7F5] border-t border-[#E6EDEA] text-center">
        <p className="type-small text-[#5C6B64]">
          {participation?.is_participating
            ? userRank
              ? `ترتيبك الحالي: ${userRank.rank} من ${userRank.total} مشارك`
              : `أنت مشارك في هذا المزاد من ${bidders?.length ?? 0} مشارك`
            : `${bidders?.length ?? 0} مشارك في المزاد`}
        </p>
      </div>
    </div>
  );
}

export default BiddersList;
