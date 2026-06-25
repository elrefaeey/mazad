import React from "react";
import { Dialog, DialogContent } from "./dialog";
import { Button } from "./button";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

const LogoutConfirmDialog: React.FC<LogoutConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "تسجيل الخروج",
  message = "هل أنت متأكد من تسجيل الخروج؟",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md !w-full !rounded-md !mx-[15px]  bg-white border-none">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3d301c]">
              <LogOut className="h-5 w-5 text-[#1F3D30]" />
            </div>
            <div className="text-lg font-semibold text-[#1F3D30]">{title}</div>
          </div>
          <div className="text-gray-600 text-base">{message}</div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="ghost"
            className="hover:!bg-transparent flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#E2112C]  text-white"
          >
            {isLoading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmDialog;
