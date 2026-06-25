import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function PaymentProcess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    const responseCode = searchParams.get("responseCode");

    const isSuccess = status === "success" && responseCode === "000";

    if (isSuccess) {
      navigate("/success?" + searchParams.toString(), { replace: true });
    } else {
      navigate("/failed?" + searchParams.toString(), { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-gray-100">
      <div className="text-center p-6 bg-white shadow-xl rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">
          جاري معالجة العملية، من فضلك انتظر...
        </p>
      </div>
    </div>
  );
}

export default PaymentProcess;
