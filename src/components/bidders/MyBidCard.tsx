import { Link } from "react-router-dom";
import { MyBid } from "../../types/myBids";
import { formatCurrency } from "../../utils/formatPrice";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ChevronLeft, Clock, Trophy, XCircle } from "lucide-react";

interface MyBidCardProps {
  bid: MyBid;
}

const BID_STATUS_CONFIG = {
  winner: {
    label: "فائز",
    bg: "bg-[#FEF3C7]",
    text: "text-[#92400E]",
    icon: Trophy,
  },
  ongoing: {
    label: "جارية",
    bg: "bg-[#E8F5EE]",
    text: "text-[#285240]",
    icon: Clock,
  },
  outbid: {
    label: "لم تفز",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    icon: XCircle,
  },
  lost: {
    label: "لم تفز",
    bg: "bg-[#FEE2E2]",
    text: "text-[#991B1B]",
    icon: XCircle,
  },
};

export function MyBidCard({ bid }: MyBidCardProps) {
  const { unit, auction, my_bid, insurance_status, bid_status } = bid;

  const statusConfig =
    BID_STATUS_CONFIG[bid_status] ?? BID_STATUS_CONFIG.ongoing;
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ar });
    } catch {
      return dateString;
    }
  };

  const auctionStatus =
    auction.status === "active"
      ? "مفتوح"
      : auction.status === "closed" || auction.status === "ended"
        ? "مغلق"
        : auction.status;

  const infoItems = [
    { label: "المساحة", value: `${unit.area} م²` },
    { label: "نسبة المقدم", value: `${my_bid.advance_value}%` },
    { label: "سعر المتر", value: formatCurrency(my_bid.price_per_meter) },
    { label: "حالة التأمين", value: insurance_status },
    { label: "حالة المزاد", value: auctionStatus },
    { label: "تاريخ المزاد", value: formatDate(auction.startDate) },
  ];

  return (
    <article className="bg-white rounded-2xl border border-[#E6EDEA] overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E6EDEA]">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full type-caption font-semibold ${statusConfig.bg} ${statusConfig.text}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </div>
        <span className="type-caption text-[#6B7280]">
          ترتيبك: <strong className="text-[#285240]">#{my_bid.rank}</strong>
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-full sm:w-36 h-28 sm:h-auto shrink-0 bg-[#F0F4F2] rounded-xl overflow-hidden">
            <img
              src={unit.image || "/placeholder-unit.jpg"}
              alt={unit.unit_number}
              className="w-full h-full object-contain p-2"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="type-subheading text-[#1a3329] mb-1">{unit.unit_number}</h3>
            <p className="type-small text-[#6B7280] mb-4">{unit.project_name}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {infoItems.map((item) => (
                <div
                  key={item.label}
                  className="bg-[#F4FAF6] rounded-lg py-2 px-2 text-center border border-[#E6EDEA]/60"
                >
                  <p className="type-caption text-[#6B7280] mb-0.5">{item.label}</p>
                  <p className="type-small font-semibold text-[#285240]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E6EDEA] flex items-center justify-between">
          <p className="type-caption text-[#6B7280]">
            إجمالي العرض:{" "}
            <strong className="type-small text-[#1a3329]">
              {formatCurrency(my_bid.total_price)} ج.م
            </strong>
          </p>
          <Link
            to={`/units/${unit.id}`}
            className="inline-flex items-center gap-1 type-small font-semibold text-[#285240] hover:text-[#1e3d30] transition-colors"
          >
            عرض الوحدة
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
