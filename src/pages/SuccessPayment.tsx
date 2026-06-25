import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

function SuccessPayment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ===== Geidea Params =====
  const transactionId =
    searchParams.get("depositId") || searchParams.get("sessionId");

  const orderId = searchParams.get("orderId");
  const unitId = searchParams.get("unitId");
  const status = searchParams.get("status");
  const responseCode = searchParams.get("responseCode");
  const responseMessage = searchParams.get("responseMessage");

  const isSuccess = status === "success" && responseCode === "000";

  // ===== Safety Check =====
  useEffect(() => {
    if (!isSuccess) {
      navigate("/failed?" + searchParams.toString(), { replace: true });
    }
  }, [isSuccess, navigate, searchParams]);

  const handleGoToAuctions = () => {
    if (!unitId) return;
    navigate(`/units/${unitId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full p-6 md:p-8 rounded-xl max-w-md mx-auto shadow-2xl bg-white animate-[scaleIn_0.5s_ease-out]">
        {/* ===== Header ===== */}
        <div className="text-center pb-6">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-800 mb-2">
            تم الدفع بنجاح!
          </div>
          <p className="text-gray-600">
            {responseMessage || "تمت معالجة دفعتك وتأكيد العملية"}
          </p>
        </div>

        {/* ===== Details ===== */}
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          {transactionId && (
            <div className="flex justify-between p-2 rounded-md hover:bg-green-50">
              <span className="text-gray-600">رقم العملية:</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
          )}

          {orderId && (
            <div className="flex justify-between p-2 rounded-md hover:bg-green-50">
              <span className="text-gray-600">رقم الطلب:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
          )}

          <div className="flex justify-between p-2 rounded-md hover:bg-green-50">
            <span className="text-gray-600">التاريخ:</span>
            <span>{getCurrentDate()}</span>
          </div>
        </div>

        {/* ===== Action ===== */}
        <div className="mt-6">
          <Button
            onClick={handleGoToAuctions}
            className="w-full bg-[#FBCD01] text-black hover:bg-yellow-500 transition-all hover:scale-105"
          >
            <Calendar className="w-4 h-4 mr-2" />
            العودة للمزاد
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPayment;
