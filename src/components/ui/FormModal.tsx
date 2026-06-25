import { Button } from "./button";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type FormModalProps = {
  children: ReactNode;
  onSubmit: () => void;
  submitLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  disabled?: boolean;
  txtBtn: string;
  describedby: string;
};

function FormModal({
  children,
  onSubmit,
  submitLoading,
  isOpen,
  onClose,
  title = "إضافة وحدة جديدة",
  disabled,
  txtBtn,
  describedby,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={describedby}
        className="mx-2 p-2 py-4 bg-[#B9B9B9] gap-0 w-full md:min-w-[550px] !rounded-3xl  border-0 shadow-2xl"
      >
        <div className=" p-3 rounded-3xl">
          <div className="flex flex-row items-center justify-center">
            <DialogTitle className="font-medium text-[#262626] text-2xl ">
              {title}
            </DialogTitle>
          </div>
        </div>

        <form className="p-4 flex flex-col gap-6" dir="rtl" onSubmit={onSubmit}>
          <div className="space-y-6">{children}</div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={disabled || submitLoading}
              className="w-full  h-10 bg-[#285240] text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]
               disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                txtBtn
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FormModal;
