import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";

function UnitTerms({
  showTermModal,
  setShowConfirmModal,
  handleConfirmTermModal,
}: {
  showTermModal: boolean;
  setShowConfirmModal: (state: boolean) => void;
  handleConfirmTermModal: () => void;
}) {
  const auctionRules: string[] = [
    "يمكنك المزايدة والتعديل خلال 3 محاولات فقط للوحدة طوال فترة المزاد",
    "عند تعديل المزايدة لا يمكن التعديل بنسبة مقدم أقل من ما سبق المزايدة به",
    "في حالة عدم الفوز بالمزاد أو الانسحاب يتم استرداد مبلغ التأمين كاملاً خلال مدة أقصاها 48 ساعة",
    "يتم تحديد الفائز بالمزاد خلال 24 ساعة من إغلاق الوحدة ويتم التواصل مع جميع المزايدين",
  ];

  return (
    <Dialog open={showTermModal} onOpenChange={setShowConfirmModal}>
      <DialogContent className="max-w-md mx-auto border border-[#E6EDEA] gap-0 p-0 !rounded-2xl bg-white overflow-hidden">
        <div className="bg-[#285240] px-5 py-4 text-center">
          <DialogTitle className="type-subheading text-white">
            شروط وأحكام المزاد
          </DialogTitle>
          <DialogDescription className="hidden">شروط وأحكام المزاد</DialogDescription>
          <p className="type-caption text-white/70 mt-1">
            اقرأ الشروط قبل تأكيد المزايدة
          </p>
        </div>

        <ul className="px-5 py-4 space-y-3">
          {auctionRules.map((text, index) => (
            <li key={text} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-md bg-[#E8F5EE] text-[#285240] type-caption font-bold flex items-center justify-center mt-0.5">
                {index + 1}
              </span>
              <p className="type-body text-[#5C6B64] leading-relaxed text-justify flex-1">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 px-5 pb-5">
          <button
            type="button"
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 h-11 rounded-xl border-2 border-[#D5E0DA] bg-white text-[#5C6B64] type-body font-semibold hover:bg-[#F4F7F5] transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirmTermModal}
            className="flex-1 h-11 rounded-xl bg-[#FBCD01] text-[#1a3329] type-body font-bold hover:bg-[#e8be00] transition-colors"
          >
            أوافق وأؤكد
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UnitTerms;
