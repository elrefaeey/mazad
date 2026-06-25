import { useNavigate, useSearchParams } from "react-router-dom";
import { RotateCcw, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

function RefundedPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const transactionId = searchParams.get("id");
  const orderId = searchParams.get("order");
  const amount = searchParams.get("refunded_amount_cents") || searchParams.get("amount_cents");
  const currency = searchParams.get("currency") || "EGP";
  const unitId = searchParams.get("merchant_order_id")?.split("_")[0] ?? "";

  const handleGoToAuctions = () => {
    navigate(`/units/${unitId}`);
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return "";
    return new Intl.NumberFormat("ar-EG").format(parseFloat(amount) / 100);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full p-6 md:p-8 rounded-xl max-w-md mx-auto shadow-2xl bg-white">
        <div className="text-center pb-6">
          <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <RotateCcw className="w-12 h-12 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-800 mb-2">
            تم رد المبلغ بنجاح
          </div>
          <p className="text-gray-600">
            تم إرجاع المبلغ إلى محفظتك نظرًا لوجود مزايد آخر سبقك
          </p>
        </div>

        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          {amount && (
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المُعاد:</span>
              <span className="font-bold text-blue-600">
                {formatAmount(amount)} {currency === "EGP" ? "جنيه" : currency}
              </span>
            </div>
          )}
          {transactionId && (
            <div className="flex justify-between">
              <span className="text-gray-600">رقم العملية:</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
          )}
          {orderId && (
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الطلب:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">التاريخ:</span>
            <span>{getCurrentDate()}</span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleGoToAuctions}
            className="w-full bg-[#FBCD01] text-black hover:bg-yellow-500"
          >
            <Calendar className="w-4 h-4 mr-2" />
            العودة للمزاد
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RefundedPayment;
