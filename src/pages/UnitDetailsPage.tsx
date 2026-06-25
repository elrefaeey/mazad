import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBidderAuth } from "../contexts/bidderAuth";
import { Button } from "../components/ui/button";
import PageSpinner from "../components/ui/PageSpinner";
import { ArrowRight } from "lucide-react";
import BidNotification from "../components/ui/BidNotification";
import useUnitSocket from "../hooks/bidding/useUnitSocket";
import BiddersList from "../components/unit-details/BiddersList";
import { useUnitDetails } from "../hooks/bidding/useUnitDetails";
import SubmitDepositBidDialog from "../components/unit-details/SubmitDepositBidDialog";
import BidDetailsSection from "../components/unit-details/BidDetailsSection";
import UnitInfoSection from "../components/unit-details/UnitInfoSection";

const UnitDetailsPage = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const { bidder, token } = useBidderAuth();

  const isAuthenticated = !!token && !!bidder;

  const {
    data: unitDetails,
    isLoading,
    error,
    isSuccess,
  } = useUnitDetails(unitId!);

  const getInitialAdvancePercentage = useCallback(() => {
    if (!unitDetails?.data) return "20";

    const unit = unitDetails.data.unit;

    const firstUnselectedAdvance = unit.advances.find(
      (advance) => advance.selected === false,
    );
    if (firstUnselectedAdvance) {
      return firstUnselectedAdvance.value.toString();
    }

    return unit.advances[unit.advances.length - 1].value.toString();
  }, [unitDetails]);

  const [advancePercentage, setAdvancePercentage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    notificationMessage,
    setShowBidNotification,
    showBidNotification,
    isSocketConnected,
    liveTopBidders,
  } = useUnitSocket({ unitId });

  useEffect(() => {
    if (unitDetails?.data) {
      setAdvancePercentage(getInitialAdvancePercentage());
    }
  }, [unitDetails, getInitialAdvancePercentage]);

  if (isLoading) {
    return <PageSpinner fullPage />;
  }

  if (error || !isSuccess) {
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center">
        <div className="container py-8 text-center">
          <h2 className="type-heading text-red-600 mb-4">خطأ في تحميل البيانات</h2>
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-xl">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  const {
    deposit,
    bidder_participation: participation,
    unit,
  } = unitDetails.data;

  return (
    <div className="min-h-screen bg-[#F4F7F5] pb-10">
      <BidNotification
        message={notificationMessage}
        isVisible={showBidNotification}
        onHide={() => setShowBidNotification(false)}
        duration={5}
      />

      <div className="container py-6 sm:py-8">
        <Link
          to="/auction"
          className="inline-flex items-center gap-1.5 type-small text-[#6B7280] hover:text-[#285240] mb-5 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمزاد
        </Link>

        {unit.auction?.name && (
          <p className="type-caption text-[#285240] bg-[#E8F5EE] inline-block px-3 py-1 rounded-full mb-3">
            {unit.auction.name}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-6">
          <UnitInfoSection unit={unit} />

          {advancePercentage && (
            <BidDetailsSection
              unitDetails={unitDetails}
              advancePercentage={advancePercentage}
              setAdvancePercentage={setAdvancePercentage}
              canBid={deposit?.can_bid}
              setShowConfirmModal={setShowConfirmModal}
              isAuthenticated={isAuthenticated}
              unitId={unitId}
            />
          )}
        </div>

        <SubmitDepositBidDialog
          setShowConfirmModal={setShowConfirmModal}
          showConfirmModal={showConfirmModal}
          advancePercentage={advancePercentage ?? "20"}
          deposit={deposit}
          participation={participation}
          unit={unit}
        />

        <BiddersList
          unitDetails={unitDetails}
          liveTopBidders={liveTopBidders}
          isSocketConnected={isSocketConnected}
          bidder={bidder}
        />
      </div>
    </div>
  );
};

export default UnitDetailsPage;
