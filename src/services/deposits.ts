import { Api } from "./api";
import {
  DepositsResponse,
  DepositsQueryParams,
  RefundRequest,
  RefundResponse,
} from "../types/deposits";

export const depositsApi = {
  // Get all deposits for admin
  getDeposits: async (
    params?: DepositsQueryParams,
  ): Promise<DepositsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.set("page", params.page.toString());
    if (params?.per_page)
      queryParams.set("per_page", params.per_page.toString());
    if (params?.status) queryParams.set("status", params.status);
    if (params?.search) queryParams.set("search", params.search);

    const { data } = await Api.get<DepositsResponse>(
      `/admin/bid-deposits/deposits?${queryParams.toString()}`,
    );
    return data;
  },

  // Get single deposit by ID
  getDepositById: async (depositId: string) => {
    const { data } = await Api.get(`/admin/bid-deposits/deposits/${depositId}`);
    return data;
  },

  // Update deposit status (if needed)
  updateDepositStatus: async (depositId: string, status: string) => {
    const { data } = await Api.patch(
      `/admin/bid-deposits/deposits/${depositId}/status`,
      { status },
    );
    return data;
  },

  // Refund deposit
  refundDeposit: async (
    depositId: string,
    refundData: RefundRequest,
  ): Promise<RefundResponse> => {
    const { data } = await Api.post<RefundResponse>(
      `/bid-deposits/${depositId}/refund`,
      refundData,
    );
    return data;
  },
};
