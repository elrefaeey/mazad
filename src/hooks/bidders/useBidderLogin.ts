import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { biddersService } from "../../services/bidders";
import { showToast } from "../../utils/toast";
import { BidderLoginRequest } from "../../types/bidders";
import { handleError } from "../../utils/errorHandling";
import { useBidderAuth } from "../../contexts/bidderAuth";

export const useBidderLogin = (onSuccess?: () => void) => {
  const { login } = useBidderAuth();

  return useMutation({
    mutationFn: (data: BidderLoginRequest) => {
      console.log("Calling bidder login API with:", data);
      showToast.loading("جاري تسجيل الدخول...");
      return biddersService.login(data);
    },
    onSuccess: (response) => {
      console.log("Login successful:", response);

      // Dismiss loading toast
      toast.dismiss();

      // استخدام context لحفظ البيانات
      login(response);

      showToast.success("تم تسجيل الدخول بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      console.error("Login error details:", error);

      // Dismiss loading toast
      toast.dismiss();

      // Use the global error handler
      handleError(error);
    },
  });
};
