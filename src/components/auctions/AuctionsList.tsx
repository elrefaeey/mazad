import { useState } from "react";
import { Plus, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "../ui/button";
import DeleteResource from "../ui/DeleteResource";
import PageSpinner from "../ui/PageSpinner";
import CreateEditAuction from "./CreateEditAuction";
import { useAuctions } from "../../hooks/auctions/useAuctions";
import { useNavigate } from "react-router-dom";
import { useCloseAuction } from "../../hooks/auctions/useCloseAuction";

type AuctionStatus = "upcoming" | "active" | "ended";

function AuctionsList() {
  const [searchTerm] = useState("");
  const [statusFilter] = useState<AuctionStatus | "all">("all");
  const navigate = useNavigate();
  const { mutate: closeAuction, isPending: closing } = useCloseAuction();

  const { data: auctionsResponse, isLoading, error } = useAuctions();
  const auctions = auctionsResponse?.data || [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy - HH:mm", { locale: ar });
    } catch {
      return "تاريخ غير صحيح";
    }
  };


  const handleViewDetails = (auctionId: string) => {
    navigate(`/admin/auctions/${auctionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <PageSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="text-red-500 mb-4">
          <Clock className="w-16 h-16 mx-auto mb-2" />
          <p className="text-lg font-semibold">حدث خطأ في تحميل المزادات</p>
          <p className="text-sm text-gray-500 mt-1">يرجى المحاولة مرة أخرى</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#DBDBDB]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CreateEditAuction>
          <Button className="flex items-center gap-2  bg-[#FBCD01] md:w-[290px] w-full text-[#262626] shadow-[0px_4px_4px_0px_#00000040]">
            <Plus className="w-4 h-4" />
            إضافة مزاد جديد
          </Button>
        </CreateEditAuction>
      </div>

      {auctions?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[#262626B2] mb-4">
            <Calendar className="w-16 h-16 mx-auto mb-2" />
            <p className="text-lg font-semibold">
              {searchTerm || statusFilter !== "all"
                ? "لا توجد مزادات تطابق البحث"
                : "لا توجد مزادات بعد"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || statusFilter !== "all"
                ? "جرب تغيير معايير البحث"
                : "ابدأ بإضافة أول مزاد لك"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {auctions.map((auction) => {

            return (
              <div
                key={auction.id}
                className="bg-[#B9B9B9] rounded-xl p-2 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#262626CC] group-hover:text-[#285240] transition-colors">
                      {auction.name}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-[#262626CC]">
                      <Calendar className="w-4 h-4" />
                      <span>البداية: {formatDate(auction.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#262626CC]">
                      <Clock className="w-4 h-4" />
                      <span>النهاية: {formatDate(auction.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#262626]/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(auction.id)}
                    className="bg-[#285240] text-white hover:bg-[#285240]/90 px-2 py-2 rounded-lg flex-1 mx-1"
                  >
                    تفاصيل
                  </Button>
                  {auction.status === "active" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={closing}
                      onClick={() =>
                        closeAuction({ id: auction.id?.toString() })
                      }
                      className="bg-[#285240] text-white hover:bg-[#285240]/90 px-2 py-2 rounded-lg flex-1 mx-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إغلاق
                    </Button>
                  )}

                  {auction.status !== "ended" && (
                    <CreateEditAuction editedAuction={auction}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-[#285240] text-white hover:bg-[#285240]/90 px-2 py-2 rounded-lg flex-1 mx-1"
                      >
                        تعديل
                      </Button>
                    </CreateEditAuction>
                  )}
                  <DeleteResource
                    url={`/admin/auctions/${auction.id}`}
                    queryKey={["auctions"]}
                    resourceName={auction.name}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-[#285240] text-white hover:bg-[#285240]/90 px-2 py-2 rounded-lg flex-1 mx-1"
                    >
                      حذف
                    </Button>
                  </DeleteResource>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AuctionsList;
