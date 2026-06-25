import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from "react";

import { useAuctionDetails } from "../hooks/auctions/useAuctionDetails";
import { useCloseUnitBid } from "../hooks/units/useCloseUnitBid";
import PageSpinner from "../components/ui/PageSpinner";
import CreateEditUnit from "../components/units/CreateEditUnit";
import DeleteResource from "../components/ui/DeleteResource";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";

const AuctionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: auction,
    isLoading,
    error,
    refetch,
  } = useAuctionDetails(id || "");
  const closeUnitBidMutation = useCloseUnitBid(id || "");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    unitId: "",
    unitNumber: "",
  });

  const auctionStatus = auction?.auction.status;
  const isUpcoming = auction?.auction.startDate
    ? new Date(auction.auction.startDate) > new Date()
    : false;
  const isActive = auctionStatus === "active";

  const canAddUnits = auction?.auction.status !== "ended";

  const canEditDeleteUnits = isUpcoming;

  const canCloseUnits = isActive;

  const handleCloseBid = (unitId: string, unitNumber: string) => {
    setConfirmDialog({
      isOpen: true,
      unitId,
      unitNumber,
    });
  };

  const handleConfirmClose = async () => {
    await closeUnitBidMutation.mutateAsync(confirmDialog.unitId);
    setConfirmDialog({ isOpen: false, unitId: "", unitNumber: "" });
  };

  const handleCancelClose = () => {
    setConfirmDialog({ isOpen: false, unitId: "", unitNumber: "" });
  };

  const handleViewBidders = (id) => {
    navigate(`/admin/auctions/${id}/bidders`);
  };

  if (isLoading) return <PageSpinner fullPage />;
  if (error)
    return (
      <div className="text-center text-red-500 py-8">خطأ في تحميل المزاد</div>
    );
  if (!auction)
    return <div className="text-center py-8">لم يتم العثور على المزاد</div>;

  return (
    <>
      <div className="container py-8 space-y-8">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isUpcoming
                  ? "bg-yellow-100 text-yellow-800"
                  : isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isUpcoming && " المزاد لم يبدأ بعد"}
              {isActive && "🔴 المزاد نشط الآن"}
              {!isUpcoming && !isActive && "✅ المزاد منتهي"}
            </div>
          </div>

          <div className="flex items-center md:flex-row flex-col justify-between gap-2">
            <h2
              className="type-heading text-center text-[#262626CC]"
            >
              الوحدات المتاحة
            </h2>
            {canAddUnits && (
              <CreateEditUnit auctionId={id || ""}>
                <Button className="flex items-center gap-2  bg-[#FBCD01] md:w-[290px] w-full text-[#262626] shadow-[0px_4px_4px_0px_#00000040]">
                  <Plus className="h-4 w-4 mr-2" />
                  إضافة وحدة جديدة
                </Button>
              </CreateEditUnit>
            )}
          </div>

          {!auction.units || auction.units.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                لا توجد وحدات في هذا المزاد
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auction.units.map((unit) => (
                <div
                  key={unit.id}
                  className="relative overflow-hidden hover:shadow-lg transition-all rounded-xl p-1 duration-300 transform hover:-translate-y-1 bg-[#B8B8B8]"
                >
                  <CardHeader className="pb-3">
                    <CardTitle
                      className="text-xl text-[#262626C9]
                  font-medium  flex items-center justify-between"
                    >
                      <span>وحدة رقم "{unit.unit_number}"</span>
                      <div className="flex items-center gap-2">
                        {unit.closed && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            مغلقة
                          </span>
                        )}
                        {!unit.image && (
                          <DeleteResource
                            queryKey={["auction-details", id]}
                            url={`/admin/units/${unit.id}`}
                            resourceName={`وحدة رقم ${unit.unit_number}`}
                            refetch={refetch}
                          >
                            <button className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </DeleteResource>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {unit.image && (
                      <div className="w-full relative">
                        <img
                          src={unit.image}
                          alt={`وحدة رقم ${unit.unit_number}`}
                          className="w-full h-48 object-cover rounded-md "
                        />
                        { (
                          <DeleteResource
                            queryKey={["auction-details", id]}
                            url={`/admin/units/${unit.id}`}
                            resourceName={`وحدة رقم ${unit.unit_number}`}
                            refetch={refetch}
                          >
                            <button className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </DeleteResource>
                        )}
                      </div>
                    )}
                    <p
                      className="text-xl font-medium text-[#262626CC]
                    line-clamp-2"
                    >
                      المساحة :{unit.area} م²
                    </p>

                    <p
                      className="text-xl font-medium text-[#262626CC]
                 line-clamp-2"
                    >
                      سعر المتر الافتتاحي :{unit.startPrice}
                    </p>
                    <p className="text-lg font-medium text-[#285240]">
                      أعلي عرض :{unit.highest_bid}
                    </p>
                    <div className="pt-2 ">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewBidders(unit.id)}
                          className="flex-1 py-3 bg-[#3D3D3D] text-white"
                          disabled={isUpcoming}
                        >
                          التفاصيل
                        </Button>

                        {canEditDeleteUnits && (
                          <>
                            <CreateEditUnit
                              editedUnit={unit}
                              auctionId={id || ""}
                            >
                              <Button
                                variant="outline"
                                className="flex-1 !bg-[#3D3D3D]
                             !py-3 text-white "
                              >
                                تعديل
                              </Button>
                            </CreateEditUnit>
                          </>
                        )}
                        {canCloseUnits && !unit.closed && (
                          <Button
                            onClick={() =>
                              handleCloseBid(unit.id, unit.unit_number)
                            }
                            size="lg"
                            className="flex-1 bg-[#E2112C] py-3 h-full text-white"
                            disabled={closeUnitBidMutation.isPending}
                          >
                            إغلاق
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="إغلاق المزايدة"
        message={`هل أنت متأكد من إغلاق المزايدة على وحدة رقم "${confirmDialog.unitNumber}"؟`}
        confirmText="إغلاق المزايدة"
        cancelText="إلغاء"
        isLoading={closeUnitBidMutation.isPending}
      />
    </>
  );
};

export default AuctionDetailsPage;
