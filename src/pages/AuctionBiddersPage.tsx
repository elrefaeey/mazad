import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuctionBidders } from "../hooks/auctions/useAuctionBidders";
import PageSpinner from "../components/ui/PageSpinner";
import { HiUsers } from "react-icons/hi";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { VITE_SOCKET_URL } from "../config/api";
import { toast } from "react-hot-toast";
import AddBidderToUnit from "../components/units/AddBidderToUnit";

export default function AuctionBiddersPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [, setRealTimeBids] = useState([]);
  const [, setIsConnectedToSocket] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastUpdate, setLastUpdate] = useState(null);

  const {
    data: initialRows = [],
    isLoading,
    error,
    refetch: refetchBidders,
  } = useAuctionBidders(id || "");

  useEffect(() => {
    if (!id) {
      console.warn("No unit ID provided");
      return;
    }

    const initializeSocket = async () => {
      try {
        // Get admin token
        const adminToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!adminToken) {
          console.warn("❌ Admin token not found");
          setConnectionStatus("error");
          toast.error("لم يتم العثور على رمز المصادقة");
          return;
        }

        console.log("🔌 Initializing Socket connection...");

        // Create socket connection
        socketRef.current = io(VITE_SOCKET_URL, {
          transports: ["websocket"],
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        // Connection events
        socket.on("connect", () => {
          console.log("✅ Socket connected with ID:", socket.id);
          console.log("Connected via:", socket.io.engine.transport.name);

          setIsConnectedToSocket(true);
          setConnectionStatus("connected");

          // Join admin monitoring for this unit
          console.log("📡 Sending admin-join-unit event...", {
            token: "***",
            unitId: id,
          });
          socket.emit("admin-join-unit", {
            token: adminToken,
            unitId: id,
          });
        });

        socket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
          setIsConnectedToSocket(false);
          setConnectionStatus("disconnected");
        });

        socket.on("connect_error", (error) => {
          console.error("🚫 Socket connection error:", error);
          setConnectionStatus("error");
          toast.error("خطأ في الاتصال: " + error.message);
        });

        // Admin-specific events
        socket.on("admin-joined-unit", (data) => {
          console.log("✅ Successfully joined unit monitoring:", data);
          setConnectionStatus("monitoring");
          const unitNumber = data.unit ? data.unit.unit_number : "غير محدد";
          toast.success(`بدأت مراقبة الوحدة: ${unitNumber}`);
        });

        socket.on("admin-left-unit", (data) => {
          console.log("ℹ️ Left unit monitoring:", data);
          setConnectionStatus("connected");
        });

        // Real-time bid updates
        socket.on("admin-bid-updated", (data) => {
          console.log("🔄 Admin bid updated received:", data);
          setLastUpdate(new Date());

          if (data.data && data.data.bidder) {
            const newBid = {
              name: data.data.bidder.name || "غير معروف",
              deposit: `${data.data.advance_value || 0}%`,
              price: (data.data.price_per_meter || 0).toLocaleString(),
              unit: data.data.unit_number || "غير محدد",
              date: new Date(data.data.bid_time).toLocaleDateString("ar-EG"),
              phone: data.data.bidder.phone || "غير متاح",
              national_id: data.data.bidder.national_id || "غير متاح",
              total_price: data.data.total_price || 0,
              highlight: true,
              isNew: true,
              bidId: data.data._id,
            };

            setRealTimeBids((prev) => {
              const updated = [
                newBid,
                ...prev.map((bid) => ({
                  ...bid,
                  highlight: false,
                  isNew: false,
                })),
              ];
              return updated.slice(0, 50); // Keep only last 50
            });

            // Show notification
            toast.success(
              `مزايدة جديدة: ${data.data.bidder.name} - ${(
                data.data.total_price || 0
              ).toLocaleString()} جنيه`,
              { duration: 4000 }
            );

            // Remove highlight after 3 seconds
            setTimeout(() => {
              setRealTimeBids((prev) =>
                prev.map((bid) => ({ ...bid, highlight: false, isNew: false }))
              );
            }, 3000);
          }
        });

        socket.on("admin-top-bidders-updated", (data) => {
          if (data.data && Array.isArray(data.data)) {
            const formattedBids = data.data.map((bid) => ({
              name: bid.bidder ? bid.bidder_name : "غير معروف",
              deposit: `${bid.advance_value || 0}%`,
              price: (bid.price_per_meter || 0).toLocaleString(),
              unit: bid.unit_number || "غير محدد",
              date: new Date(bid.bid_time).toLocaleDateString("ar-EG"),
              phone: bid.bidder ? bid.bidder.phone : "غير متاح",
              national_id: bid.bidder ? bid.bidder.national_id : "غير متاح",
              total_price: bid.total_price || 0,
              highlight: false,
              isNew: false,
              bidId: bid._id,
            }));

            setRealTimeBids(formattedBids);
            setLastUpdate(new Date());
          }
        });

        socket.on("admin-bid-withdrawn", (data) => {
          setRealTimeBids((prev) =>
            prev.filter((bid) => bid.bidId !== data.bidId)
          );
        });

        socket.on("admin-new-bid-notification", (data) => {
          console.log("🔔 New bid notification:", data);
          // Additional handling if needed
        });

        socket.on("error", (error) => {
          console.error("🚫 Socket error:", error);
          toast.error(`خطأ: ${error.message}`);
          setConnectionStatus("error");
        });
      } catch (error) {
        console.error("💥 Error initializing socket:", error);
        setConnectionStatus("error");
        toast.error("خطأ في تهيئة الاتصال");
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up socket connection...");
        if (id) {
          socketRef.current.emit("admin-leave-unit", id);
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnectedToSocket(false);
      setConnectionStatus("disconnected");
    };
  }, [id]);

  // Merge initial data with real-time data
  const combinedRows = initialRows ?? [];

  if (isLoading) {
    return <PageSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold  text-red-600 mb-4">
            خطأ في تحميل البيانات
          </h2>
          <Button onClick={() => navigate(`/admin/auctions`)} variant="outline">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  // Connection status indicator
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-yellow-500";
      case "monitoring":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "متصل";
      case "monitoring":
        return "يراقب المزايدات";
      case "error":
        return "خطأ في الاتصال";
      default:
        return "غير متصل";
    }
  };

  return (
    <div className="container py-4 sm:py-8">
      <div className="mb-4 sm:mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-2 sm:mb-4 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>

        {/* Real-time Status Indicator */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#262626CC]">
            قائمة المزايدين - مباشر
          </h1>

          <div className="flex items-center gap-4">
            <AddBidderToUnit
              unitId={id || ""}
              onSuccess={() => {
                // Refresh data after adding bidder
                console.log("Bidder added successfully - refreshing data...");
                refetchBidders();
              }}
            >
              <Button
                variant="default"
                className="bg-[#285240] hover:bg-[#1f3f32] text-white"
              >
                إضافة مزايد
              </Button>
            </AddBidderToUnit>

            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}
              ></div>
              <span className="text-gray-600">{getStatusText()}</span>
              {lastUpdate && (
                <span className="text-xs text-gray-500">
                  آخر تحديث: {lastUpdate.toLocaleTimeString("ar-EG")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#E4E4E4] flex flex-col gap-2 p-2 sm:p-4 rounded-md mx-auto">
        <div className="rounded-md flex flex-col gap-2 overflow-hidden">
          <div className="hidden lg:grid bg-[#2D2D2D] rounded-md text-white text-center py-3 text-sm font-medium grid-cols-7 gap-2">
            <div>الاسم</div>
            <div>المقدم</div>
            <div>سعر المتر</div>
            <div>رقم الوحدة</div>
            <div>التاريخ</div>
            <div>رقم الهاتف</div>
            <div>الرقم القومي</div>
          </div>

          {combinedRows.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-md">
              <HiUsers className="text-4xl sm:text-6xl mb-2 sm:mb-4 mx-auto text-[#285240]" />
              <p className="text-lg sm:text-xl text-gray-600 px-4">
                {connectionStatus === "monitoring"
                  ? "في انتظار المزايدات... المراقبة نشطة 🔴"
                  : "لا توجد مزايدات على هذه الوحدة"}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block lg:my-2">
                {combinedRows.map((row, index) => (
                  <div
                    key={`${row.national_id}-${index}`}
                    className={`grid grid-cols-7 gap-2 px-2 !rounded-xl text-center text-sm lg:my-2 py-3 transition-all duration-500 ${
                      row.highlight
                        ? "bg-[#285240] text-white !rounded-xl shadow-lg transform "
                        : index % 2 === 0
                        ? "bg-[#D9D9D9]"
                        : "bg-[#B9B9B9]"
                    }`}
                  >
                    <div className="px-2 flex items-center justify-center">
                      {row.name}
                    </div>
                    <div className="px-2">{row.deposit}</div>
                    <div className="px-2 font-bold">{row.price}</div>
                    <div className="px-2">{row.unit}</div>
                    <div className="px-2">{row.date}</div>
                    <div className="px-2">{row.phone}</div>
                    <div className="px-2">{row.national_id}</div>
                  </div>
                ))}
              </div>

              <div className="lg:hidden space-y-3">
                {combinedRows.map((row, index) => (
                  <div
                    key={`${row.national_id}-${index}`}
                    className={`rounded-xl p-3 sm:p-4 shadow-sm transition-all duration-500 ${
                      row.highlight
                        ? "bg-[#285240] text-white shadow-xl transform"
                        : index % 2 === 0
                        ? "bg-[#F3F3F3]"
                        : "bg-[#E2E2E2]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm sm:text-base font-semibold flex items-center">
                        {row.name}
                      </h3>
                      <span className="text-sm sm:text-base font-bold">
                        {row.price} ج.م
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium">الوحدة:</span> {row.unit}
                      </div>
                      <div>
                        <span className="font-medium">المقدم:</span>{" "}
                        {row.deposit}
                      </div>
                      <div>
                        <span className="font-medium">رقم الهاتف:</span>{" "}
                        {row.phone}
                      </div>
                      <div>
                        <span className="font-medium">تاريخ:</span> {row.date}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">الرقم القومي:</span>{" "}
                        {row.national_id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {combinedRows.length > 0 && (
          <div className="mt-2 sm:mt-4 bg-white rounded-md p-2 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between   sm:items-center gap-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>إجمالي المزايدين: {combinedRows.length}</span>
                {connectionStatus === "monitoring" && (
                  <span className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    مراقبة مباشرة نشطة
                  </span>
                )}
              </div>
              <span>
                أعلى مقدم:{""}
                {Math.max(
                  ...combinedRows.map(
                    (r) =>
                      parseInt(
                        r.advance_amount?.toString().replace(/,/g, "")
                      ) || 0
                  )
                ).toLocaleString()}{" "}
                جنيه
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
