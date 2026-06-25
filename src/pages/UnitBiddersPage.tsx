import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  User,
  Calendar,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import PageSpinner from "../components/ui/PageSpinner";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuctionDetails } from "../hooks/auctions/useAuctionDetails";
import { useCloseUnitBid } from "../hooks/units/useCloseUnitBid";
import { useUnitBidders } from "../hooks/units/useUnitBidders";
import AddBidderToUnit from "../components/units/AddBidderToUnit";

function UnitBiddersPageContent() {
  const { auctionId, unitId } = useParams<{
    auctionId: string;
    unitId: string;
  }>();
  const navigate = useNavigate();

  const { data: auctionDetails, isLoading: auctionLoading } = useAuctionDetails(
    auctionId || ""
  );
  const { data: bidders = [], isLoading: biddersLoading } = useUnitBidders(
    unitId || ""
  );

  const { mutate: closeUnitBid, isPending: isClosing } = useCloseUnitBid(
    auctionId || "",
    () => {
      navigate(`/auctions/${auctionId}`);
    }
  );

  const isLoading = auctionLoading || biddersLoading;

  if (isLoading) {
    return <PageSpinner fullPage />;
  }

  const auction = auctionDetails?.auction;
  const unit = auctionDetails?.units?.find((u) => u.id === unitId);

  if (!auction || !unit) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="text-red-500 mb-4">
          <p className="text-lg font-semibold">لم يتم العثور على الوحدة</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/auctions/${auctionId}`);
  };

  const handleCloseBid = () => {
    if (unitId) {
      closeUnitBid(unitId);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-[#DBDBDB] min-h-screen">
      aa
      <div className="flex items-center justify-between">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="flex items-center gap-2 text-[#262626] hover:bg-[#B9B9B9]"
        >
          <ArrowRight className="w-4 h-4" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold text-[#262626]">قائمة المزايدين</h1>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                قائمة المزايدين
              </h2>
              <p className="text-sm text-gray-600">
                الوحدة رقم {unit.unit_number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Add Bidder Button */}
            <AddBidderToUnit
              unitId={unitId || ""}
              onSuccess={() => {
                // Refresh the data by navigating to the same page
                window.location.reload();
              }}
            >
              <Button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                إضافة مزايد
              </Button>
            </AddBidderToUnit>

            <Button
              onClick={handleCloseBid}
              disabled={isClosing}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isClosing ? "جاري الإغلاق..." : "إغلاق المزاد"}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-700 text-center">
            <div>الترتيب</div>
            <div>الاسم</div>
            <div>الهاتف</div>
            <div>الرقم القومي</div>
            <div>نسبة المقدم</div>
            <div>سعر المتر</div>
            <div>إجمالي السعر</div>
            <div>التاريخ</div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {bidders.length > 0 ? (
            bidders.map((bidder, index) => (
              <div
                key={bidder.id}
                className={`grid grid-cols-8 gap-4 p-4 text-sm text-center border-b border-gray-100 ${
                  bidder.isWinning
                    ? "bg-green-50 border-green-200"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-center">
                  <span
                    className={`font-bold ${
                      bidder.isWinning ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    #{index + 1}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{bidder.name}</span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="font-mono">{bidder.phone}</span>
                </div>

                <div className="flex items-center justify-center">
                  <span className="font-mono text-xs">{bidder.nationalId}</span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-gray-800">
                    {bidder.bidPercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold">
                    {bidder.pricePerMeter.toLocaleString()} ج.م
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-purple-600">
                    {bidder.totalPrice.toLocaleString()} ج.م
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs">{bidder.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              لا توجد مزايدات حتى الآن
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                إجمالي المزايدين:{" "}
                <span className="font-bold">{bidders.length}</span>
              </div>
            </div>
            {bidders.find((b) => b.isWinning) && (
              <div className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                العرض الفائز: مقدم{" "}
                {bidders.find((b) => b.isWinning)?.bidPercentage}% -{" "}
                {bidders
                  .find((b) => b.isWinning)
                  ?.pricePerMeter.toLocaleString()}{" "}
                ج.م
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin-only protected page wrapper
function UnitBiddersPage() {
  return (
    <ProtectedRoute>
      <UnitBiddersPageContent />
    </ProtectedRoute>
  );
}

export default UnitBiddersPage;
