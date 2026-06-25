import { Link } from "react-router-dom";
import { useMyBids } from "../hooks/bidders/useMyBids";
import { MyBidCard } from "../components/bidders/MyBidCard";
import { Loader2, ClipboardList } from "lucide-react";

function MyBidsPage() {
  const { data, isLoading } = useMyBids();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#285240] mx-auto mb-3" />
          <p className="type-body text-[#6B7280]">جاري تحميل سجل المزايدات...</p>
        </div>
      </div>
    );
  }

  const bids = data?.data?.bids || [];

  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-10">
      <div className="container py-8 sm:py-10">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="type-heading text-[#1a3329] mb-2">سجل المزايدات</h1>
          <p className="type-body text-[#6B7280]">
            تابع كل مزايداتك وحالة مشاركتك في المزادات
          </p>
        </header>

        {bids.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#E6EDEA] p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F5EE] flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-[#285240]" />
            </div>
            <h3 className="type-subheading text-[#1a3329] mb-2">
              لا توجد مزايدات بعد
            </h3>
            <p className="type-body text-[#6B7280] mb-6 leading-relaxed">
              لم تقم بأي مزايدات حتى الآن. ابدأ بالمشاركة في المزادات المتاحة!
            </p>
            <Link
              to="/auction"
              className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-[#285240] text-white type-body font-semibold hover:bg-[#1e3d30] transition-colors"
            >
              تصفح المزادات
            </Link>
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl mx-auto">
            {bids.map((bid) => (
              <MyBidCard key={bid.unit.id} bid={bid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBidsPage;
