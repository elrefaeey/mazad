import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, RotateCcw, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";

function FailedPayment() {
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
  // لو العملية نجحت بالغلط وجات على failed
  useEffect(() => {
    if (isSuccess) {
      navigate("/success?" + searchParams.toString(), { replace: true });
    }
  }, [isSuccess, navigate, searchParams]);

  const handleRetry = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full p-6 md:p-8 rounded-xl max-w-md mx-auto shadow-2xl bg-white animate-[scaleIn_0.5s_ease-out]">
        {/* ===== Header ===== */}
        <div className="text-center pb-6">
          <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-800 mb-2">
            فشلت عملية الدفع
          </div>
          <p className="text-gray-600">
            {responseMessage || "لم تكتمل عملية الدفع، يرجى المحاولة مرة أخرى"}
          </p>
        </div>

        {/* ===== Details ===== */}
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          {transactionId && (
            <div className="flex justify-between p-2 rounded-md hover:bg-red-50">
              <span className="text-gray-600">رقم العملية:</span>
              <span className="font-mono text-sm">{transactionId}</span>
            </div>
          )}

          {orderId && (
            <div className="flex justify-between p-2 rounded-md hover:bg-red-50">
              <span className="text-gray-600">رقم الطلب:</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
          )}

          <div className="flex justify-between p-2 rounded-md hover:bg-red-50">
            <span className="text-gray-600">التاريخ:</span>
            <span>{getCurrentDate()}</span>
          </div>
        </div>

        {/* ===== Actions ===== */}
        <div className="mt-6 space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full bg-red-600 text-white hover:bg-red-700 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة المحاولة
          </Button>

          <Button
            onClick={() => navigate("/home")}
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-100 transition-all hover:scale-105"
          >
            <Calendar className="w-4 h-4 mr-2" />
            العودة للصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FailedPayment;
