// import { useState } from "react";
// import { useRefundDeposit } from "../../hooks/deposits/useDeposits";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import { DollarSign } from "lucide-react";

// interface RefundDepositDialogProps {
//   depositId: string;
//   depositAmount: number;
//   children?: React.ReactNode;
//   onSuccess?: () => void;
// }

// export const RefundDepositDialog = ({
//   depositId,
//   depositAmount,
//   children,
//   onSuccess,
// }: RefundDepositDialogProps) => {
//   const [open, setOpen] = useState(false);
//   const [refundAmount, setRefundAmount] = useState<string>("");
//   const [callbackUrl, setCallbackUrl] = useState<string>("");
//   const [reason, setReason] = useState<string>("");
//   const [isPartialRefund, setIsPartialRefund] = useState(false);

//   const refundMutation = useRefundDeposit();

//   const handleRefund = async () => {
//     const refundData = {};

//     if (isPartialRefund && refundAmount) {
//       const amount = parseFloat(refundAmount);
//       if (isNaN(amount) || amount <= 0 || amount > depositAmount) {
//         return;
//       }
//       refundData.refundAmount = amount;
//     }

//     if (callbackUrl) {
//       refundData.callbackUrl = callbackUrl;
//     }

//     if (reason) {
//       refundData.reason = reason;
//     }

//       await refundMutation.mutateAsync({ depositId, refundData });
//       setOpen(false);
//       resetForm();
//       onSuccess?.();

//   };

//   const resetForm = () => {
//     setRefundAmount("");
//     setCallbackUrl("");
//     setReason("");
//     setIsPartialRefund(false);
//   };

//   const handleOpenChange = (newOpen: boolean) => {
//     setOpen(newOpen);
//     if (!newOpen) {
//       resetForm();
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         {children || (
//           <Button variant="outline" size="sm">
//             <DollarSign className="h-4 w-4 ml-2" />
//             استرداد
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[500px] bg-gray-300 border-none">
//         <DialogHeader>
//           <DialogTitle>استرداد المبلغ</DialogTitle>
//           <DialogDescription>
//             قم باسترداد مبلغ التأمين للمزايد. يمكنك اختيار استرداد كامل أو جزئي.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <span className="text-sm font-medium text-gray-700">
//                 مبلغ التأمين الكلي:
//               </span>
//               <span className="text-lg font-bold text-[#285240]">
//                 {depositAmount.toLocaleString()} جنيه
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2 space-x-reverse">
//             <input
//               type="checkbox"
//               id="partialRefund"
//               checked={isPartialRefund}
//               onChange={(e) => setIsPartialRefund(e.target.checked)}
//               className="h-4 w-4 rounded border-gray-300 text-[#285240] focus:ring-[#285240]"
//             />
//             <Label htmlFor="partialRefund" className="cursor-pointer">
//               استرداد جزئي
//             </Label>
//           </div>

//           {isPartialRefund && (
//             <div className="space-y-2">
//               <Label htmlFor="refundAmount">مبلغ الاسترداد</Label>
//               <div className="relative">
//                 <Input
//                   id="refundAmount"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max={depositAmount}
//                   value={refundAmount}
//                   onChange={(e) => setRefundAmount(e.target.value)}
//                   placeholder={`أدخل المبلغ (الحد الأقصى ${depositAmount})`}
//                   className="pr-16 border-black"
//                 />
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
//                   جنيه
//                 </span>
//               </div>
//               {refundAmount && parseFloat(refundAmount) > depositAmount && (
//                 <p className="text-sm text-red-600">
//                   المبلغ أكبر من مبلغ التأمين
//                 </p>
//               )}
//             </div>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="reason">سبب الاسترداد (اختياري)</Label>
//             <Textarea
//               id="reason"
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="أدخل سبب استرداد المبلغ..."
//               rows={3}
//               className="border-black"
//             />
//           </div>

//           {/* <div className="space-y-2">
//             <Label htmlFor="callbackUrl">رابط الإشعار (اختياري)</Label>
//             <Input
//               id="callbackUrl"
//               type="url"
//               value={callbackUrl}
//               onChange={(e) => setCallbackUrl(e.target.value)}
//               placeholder="https://..."
//               className="pr-16 border-black"
//             />
//             <p className="text-xs text-gray-500">
//               رابط webhook لإرسال إشعار عند اكتمال الاسترداد
//             </p>
//           </div> */}
//         </div>

//         <DialogFooter className="flex items-center gap-2 border-none">
//           <Button
//             variant="outline"
//             onClick={() => setOpen(false)}
//             disabled={refundMutation.isPending}
//             className="bg-red-500 text-white"
//           >
//             إلغاء
//           </Button>
//           <Button
//             onClick={handleRefund}
//             disabled={
//               refundMutation.isPending ||
//               (isPartialRefund &&
//                 (!refundAmount ||
//                   parseFloat(refundAmount) <= 0 ||
//                   parseFloat(refundAmount) > depositAmount))
//             }
//             className="bg-primary text-white hover:bg-[#1f3f32]"
//           >
//             {refundMutation.isPending ? "جاري الاسترداد..." : "تأكيد الاسترداد"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
