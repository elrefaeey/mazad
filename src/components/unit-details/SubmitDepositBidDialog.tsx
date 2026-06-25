import { Deposit, UnitDetails } from "../../types/bidding";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../ui/button";
import { useCreateDeposit, usePlaceBid } from "../..//hooks/bidding/useBidding";
import { useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/formatPrice";

function SubmitDepositBidDialog({
  deposit,
  showConfirmModal,
  setShowConfirmModal,
  advancePercentage,
  unit,
  participation,
}: {
  deposit: Deposit;
  setShowConfirmModal: (state: boolean) => void;
  showConfirmModal: boolean;
  advancePercentage: string;
  unit: UnitDetails;
  participation;
}) {
  const { unitId } = useParams<{ unitId: string }>();
  const createDepositMutation = useCreateDeposit();
  const placeBidMutation = usePlaceBid();

  const handleCreateDeposit = ({ price_per_meter, advance_value }) => {
    if (!unitId) return;

    createDepositMutation.mutate(
      { unitId, price_per_meter, advance_value },
      {
        onSuccess: (response) => {
          if (response.data.payment_url) {
            window.open(response.data.payment_url, "_self");
          }
          setShowConfirmModal(false);
        },
      }
    );
  };

  const handleConfirmBid = () => {
    if (!unitId || !advancePercentage || !unit) {
      return;
    }
    const currentAdvance = unit.advances.find(
      (val) => Number(advancePercentage) === val.value
    );

    if (!currentAdvance) {
      return;
    }

    if (!deposit?.can_bid) {
      handleCreateDeposit({
        price_per_meter: currentAdvance?.price_per_meter,
        advance_value: parseInt(advancePercentage),
      });
      return;
    }

    if (deposit && deposit?.has_deposit && !deposit?.can_bid) {
      return;
    }

    placeBidMutation.mutate({
      unit_id: unitId,
      price_per_meter: currentAdvance?.price_per_meter,
      advance_value: parseInt(advancePercentage),
    });

    setShowConfirmModal(false);
  };
  return (
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
      <DialogContent
        className="max-w-md mx-auto border-none gap-4 !rounded-xl !bg-[#D6D6D6]"
        aria-describedby={
          !deposit?.has_deposit
            ? "لضمان جدية العرض برجاء دفع عربون 5 جنية وفي حالة عدم التعاقد يتم إسترداد التأمين كاملاً"
            : deposit?.can_bid
            ? "تم دفع التأمين بنجاح. يمكنك الآن تأكيد عرضك."
            : deposit?.payment_status === "pending"
            ? "التأمين قيد المراجعة. يرجى انتظار تأكيد الدفع."
            : deposit?.is_expired
            ? "انتهت صلاحية التأمين. يرجى دفع عربون جديد."
            : "لضمان جدية العرض برجاء دفع عربون 5 جنية وفي حالة عدم التعاقد يتم إسترداد التأمين كاملاً"
        }
      >
        <DialogHeader>
          <DialogTitle className="text-center !text-2xl font-bold text-[#285240]">
            {!deposit?.has_deposit
              ? "تأكيد الاشتراك في المزاد"
              : deposit?.can_bid
              ? participation?.is_participating
                ? "تعديل العرض"
                : "إرسال العرض"
              : "تأكيد الاشتراك في المزاد"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-[#262626CC] text-xl">
          {!deposit?.has_deposit
            ? "لضمان جدية الحجز برجاء دفع مبلغ تامين 5 جنية وفي حالة عدم التعاقد يتم إسترداد العربون كاملا "
            : deposit?.can_bid
            ? "تم دفع التأمين بنجاح. يمكنك  تغيير عرضك."
            : deposit?.payment_status === "pending"
            ? "التأمين قيد المراجعة. يرجى انتظار تأكيد الدفع."
            : "لضمان جدية العرض برجاء دفع عربون 5 جنية وفي حالة عدم التعاقد يتم إسترداد التأمين كاملاً"}
        </DialogDescription>
        <div className="space-y-4  py-4 bg-[#28524021] rounded-xl">
          <div className="text-center space-y-1 text-[#262626CC]">
            <h3 className="text-2xl font-medium text-[#262626CC] mb-3">
              تفاصيل المزايدة:
            </h3>
            <p className="text-xl ">نسبة المقدم: {advancePercentage}%</p>
            <p className="text-xl ">
              سعر المتر:{" "}
              {formatCurrency(
                unit.advances.find(
                  (val) => Number(advancePercentage) === val.value
                )?.price_per_meter || 0
              )}
            </p>
            <p className="text-xl ">
              اجمالي الوحدة:{" "}
              {formatCurrency(
                (unit.advances.find(
                  (val) => Number(advancePercentage) === val.value
                )?.price_per_meter || 0) * unit.area
              )}
            </p>
          </div>
        </div>
        <div className="!flex gap-3 flex-nowrap !flex-row  mx-auto justify-center items-center">
          <Button
            variant="outline"
            onClick={() => setShowConfirmModal(false)}
            className="px-3 sm:px-6 py-2  text-[#262626CC] font-medium border-[2px]
               rounded-xl bg-transparent border-[#262626CC] hover:bg-[#262626CC]
               hover:text-white transition-all duration-300  text-base sm:text-lg"
          >
            تعديل العرض
          </Button>
          <Button
            onClick={handleConfirmBid}
            disabled={
              placeBidMutation.isPending || createDepositMutation.isPending
            }
            className="
           px-3 sm:px-[25px] py-[10px]  font-medium  rounded-xl bg-[#FBCD01]  shadow-[0px_4px_4px_0px_#00000040]  hover:bg-[#262626CC]
               hover:text-white text-[#262626CC] transition-all
                duration-300 !m-0 text-base sm:text-lg"
          >
            {placeBidMutation.isPending
              ? "جاري تقديم العرض..."
              : createDepositMutation.isPending
              ? "جاري إنشاء طلب الدفع..."
              : !deposit?.has_deposit
              ? "دفع التأمين"
              : deposit?.can_bid
              ? "تأكيد العرض"
              : "دفع التأمين"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitDepositBidDialog;
