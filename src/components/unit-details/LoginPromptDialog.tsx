import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: string;
  auctionId?: string;
}

export function LoginPromptDialog({
  isOpen,
  onClose,
  unitId,
  auctionId,
}: LoginPromptDialogProps) {
  const navigate = useNavigate();

  const buildNavigationParams = () => {
    const params = new URLSearchParams();
    if (unitId) params.append("redirect_unit", unitId);
    if (auctionId) params.append("auction_id", auctionId);
    return params.toString() ? `?${params.toString()}` : "";
  };

  const handleLogin = () => {
    onClose();
    navigate(`/login${buildNavigationParams()}`);
  };

  const handleSignup = () => {
    onClose();
    navigate(`/signup${buildNavigationParams()}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-[#D9D9D9] rounded-2xl py-4 border-none">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-[#285240] text-center">
            تسجيل الدخول مطلوب
          </DialogTitle>
          <DialogDescription className="text-[#262626CC] text-lg text-center leading-relaxed">
            للاشتراك في هذا المزاد، يجب عليك تسجيل الدخول أولاً.
          </DialogDescription>
          <p className="text-[#2626268C] text-center">
            بالتسجيل توافق على الشروط والأحكام وسياسة الخصوصية.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleLogin}
            className="mx-auto !bg-[#285240] text-white text-base rounded-xl py-2 hover:bg-[#1d3a2f] w-3/4"
          >
            تسجيل الدخول
          </Button>

          <Button
            onClick={handleSignup}
            variant="outline"
            className="mx-auto bg-transparent border-2 border-[#285240] text-[#285240] text-base rounded-xl py-2 hover:bg-[#285240] hover:text-white w-3/4 transition-colors"
          >
            إنشاء حساب جديد
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
