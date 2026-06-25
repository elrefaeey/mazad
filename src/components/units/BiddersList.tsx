import { useState } from "react";
import { X, Phone, User, Calendar, Hash, DollarSign } from "lucide-react";
import { Button } from "../ui/button";

interface Bidder {
  id: string;
  name: string;
  phone: string;
  bidAmount: number;
  bidPercentage: number;
  timestamp: string;
  unitNumber: string;
  pricePerMeter: number;
  isWinning?: boolean;
}

interface Props {
  unitId: string;
  unitNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onCloseBid: (unitId: string) => void;
}

const mockBidders: Bidder[] = [
  {
    id: "1",
    name: "أحمد جمال",
    phone: "56654567",
    bidAmount: 40,
    bidPercentage: 40,
    timestamp: "12/6 - 2:30:8",
    unitNumber: "12",
    pricePerMeter: 16000,
  },
  {
    id: "2",
    name: "محمد علي",
    phone: "56654568",
    bidAmount: 45,
    bidPercentage: 45,
    timestamp: "12/6 - 2:35:2",
    unitNumber: "12",
    pricePerMeter: 17000,
  },
  {
    id: "3",
    name: "سارة أحمد",
    phone: "256654567",
    bidAmount: 48,
    bidPercentage: 48,
    timestamp: "12/6 - 2:40:15",
    unitNumber: "12",
    pricePerMeter: 18000,
  },
  {
    id: "4",
    name: "خالد محمد",
    phone: "56654569",
    bidAmount: 50,
    bidPercentage: 50,
    timestamp: "12/6 - 2:45:8",
    unitNumber: "12",
    pricePerMeter: 19000,
    isWinning: true,
  },
  {
    id: "5",
    name: "فاطمة عبدالله",
    phone: "56654570",
    bidAmount: 42,
    bidPercentage: 42,
    timestamp: "12/6 - 2:32:5",
    unitNumber: "12",
    pricePerMeter: 16500,
  },
];

function BiddersList({
  unitId,
  unitNumber,
  isOpen,
  onClose,
  onCloseBid,
}: Props) {
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleCloseBid = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCloseBid(unitId);
      onClose();
      setIsClosing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                قائمة المزايدين
              </h2>
              <p className="text-sm text-gray-600">الوحدة رقم {unitNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCloseBid}
              disabled={isClosing}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isClosing ? "جاري الإغلاق..." : "إغلاق المزاد"}
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-gray-50 p-4">
          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700 text-center">
            <div>الاسم</div>
            <div>المقدم</div>
            <div>سعر المتر</div>
            <div>رقم الوحدة</div>
            <div>التاريخ</div>
            <div>رقم الهاتف</div>
            <div>الاسم</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="max-h-96 overflow-y-auto">
          {mockBidders
            .sort((a, b) => b.bidPercentage - a.bidPercentage) // ترتيب حسب المزايدة الأعلى
            .map((bidder, index) => (
              <div
                key={bidder.id}
                className={`grid grid-cols-7 gap-4 p-4 text-sm text-center border-b border-gray-100 ${
                  bidder.isWinning
                    ? "bg-blue-50 border-blue-200"
                    : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{bidder.name}</span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-gray-800">
                    مقدم {bidder.bidPercentage}%
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold">
                    {bidder.pricePerMeter.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span>{bidder.unitNumber}</span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{bidder.timestamp}</span>
                </div>

                <div className="flex items-center justify-center gap-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="font-mono">{bidder.phone}</span>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{bidder.name}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              إجمالي المزايدين:{" "}
              <span className="font-bold">{mockBidders.length}</span>
            </div>
            {mockBidders.find((b) => b.isWinning) && (
              <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                العرض الفائز: مقدم{" "}
                {mockBidders.find((b) => b.isWinning)?.bidPercentage}% -{" "}
                {mockBidders
                  .find((b) => b.isWinning)
                  ?.pricePerMeter.toLocaleString()}{" "}
                جنيه
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BiddersList;
