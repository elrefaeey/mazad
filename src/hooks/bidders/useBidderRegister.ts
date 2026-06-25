import { useMutation } from "@tanstack/react-query";
import { biddersService } from "../../services/bidders";
import { showToast } from "../../utils/toast";
import { BidderRegisterRequest } from "../../types/bidders";
import { handleError } from "../../utils/errorHandling";
import { useBidderAuth } from "../../contexts/bidderAuth";

export const useBidderRegister = (onSuccess?: () => void) => {
  const { register } = useBidderAuth();

  return useMutation({
    mutationFn: (data: BidderRegisterRequest) => biddersService.register(data),
    onSuccess: (response) => {
      console.log("Register successful:", response);

      // استخدام context لحفظ البيانات
      register(response);

      showToast.success("تم التسجيل بنجاح");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      handleError(error);
    },
  });
};
