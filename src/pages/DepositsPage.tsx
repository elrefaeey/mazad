import { useState } from "react";
import { useDeposits } from "../hooks/deposits/useDeposits";
import { DepositsQueryParams } from "../types/deposits";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
// import { RefundDepositDialog } from "../components/deposits/RefundDepositDialog";

import { formatPrice } from "../utils/formatPrice";
import {
  ExternalLink,
  Search,
  User,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react";

const DepositsPage = () => {
  const [queryParams, setQueryParams] = useState<DepositsQueryParams>({
    page: 1,
    per_page: 20,
    search: "",
  });

  const { data: depositsData, isLoading, error } = useDeposits(queryParams);

  const handleSearch = (search: string) => {
    setQueryParams((prev) => ({ ...prev, search, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "failed":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "مكتملة";
      case "processing":
        return "قيد المعالجة";
      case "failed":
        return "فاشلة";
      case "expired":
        return "منتهية الصلاحية";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-white">
              <div className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6">
        <div>
          <div className="p-6 text-center">
            <p className="text-destructive">حدث خطأ في تحميل البيانات</p>
          </div>
        </div>
      </div>
    );
  }

  const deposits = depositsData?.data?.deposits || [];
  const pagination = depositsData?.data?.pagination;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="type-heading mb-4">إدارة الودائع والمدفوعات</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث برقم الهاتف أو الاسم..."
              value={queryParams.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 border-blue-950 bg-white text-black placeholder:text-black"
            />
          </div>
        </div>
      </div>

      {/* Deposits Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deposits.map((deposit) => (
          <div
            key={deposit?._id}
            className="hover:shadow-lg bg-white transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  وديعة #{deposit?._id.slice(-8)}
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(deposit.payment_status)}>
                  {getStatusText(deposit.payment_status)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Amount */}
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold">
                  {formatPrice(deposit.amount)} جنيه
                </span>
              </div>

              {/* Bidder Info */}
              {deposit.bidder && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{deposit.bidder.name}</p>
                    <p className="text-sm text-gray-600">
                      {deposit.bidder.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Unit Info */}
              {deposit.unit && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-orange-600" />
                  <div className="flex-1">
                    <p className="font-medium">{deposit.unit.unit_number}</p>
                    <p className="text-sm text-gray-600">
                      المساحة: {deposit.unit.area} م²
                    </p>
                  </div>
                </div>
              )}

              {/* Auction Info */}
              {deposit.auction && (
                <div className="text-sm">
                  <p className="font-medium">{deposit.auction.name}</p>
                </div>
              )}

              {/* Dates */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span>تاريخ الإنشاء: {formatDate(deposit.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>تاريخ الانتهاء: {formatDate(deposit.expires_at)}</span>
                </div>
              </div>

              {/* Payment URL */}
              {deposit?.payment_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-[#285240] text-white"
                  onClick={() => window.open(deposit.payment_url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  رابط الدفع
                </Button>
              )}

              {/* Refund Button - Only show for completed deposits */}
              {/* {deposit.payment_status === "paid" && (
                <RefundDepositDialog
                  depositId={deposit._id}
                  depositAmount={deposit.amount}
                  onSuccess={() => {
                    // Refetch deposits after successful refund
                    window.location.reload();
                  }}
                />
              )} */}

              {/* Latest Status */}
              {deposit.status_history && deposit.status_history.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium">آخر حالة:</p>
                  <p className="text-gray-600">
                    {
                      deposit.status_history[deposit.status_history.length - 1]
                        .notes
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(
                      deposit.status_history[deposit.status_history.length - 1]
                        .changed_at,
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {deposits.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد ودائع متاحة</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            السابق
          </Button>

          <span className="flex items-center px-4 py-2 bg-gray-100 rounded">
            صفحة {pagination.current_page} من {pagination.total_pages}
          </span>

          <Button
            variant="outline"
            disabled={pagination.current_page === pagination.total_pages}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};

export default DepositsPage;
