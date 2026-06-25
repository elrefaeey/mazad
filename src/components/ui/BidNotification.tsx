import { useEffect, useState } from "react";
import Notify from "../../assets/notify.svg";

interface BidNotificationProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
}

const BidNotification = ({
  message,
  isVisible,
  onHide,
  duration = 5,
}: BidNotificationProps) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      setIsExiting(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration * 10);

        if (newProgress <= 10 && !isExiting) {
          setIsExiting(true);
        }

        if (newProgress <= 0) {
          clearInterval(interval);
          setTimeout(() => {
            onHide();
          }, 400);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, duration, onHide, isExiting]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`
           bg-[#285240] 
          w-full text-white py-0 rounded-[24px] 
          shadow-2xl shadow-[#4A5D78]/30 bg-opacity-60
          overflow-hidden border border-white/20 
          transform transition-all duration-700 ease-out
          backdrop-blur-sm   min-w-[320px] max-w-[700px]
          hover:shadow-[#4A5D78]/50 hover:scale-[1.02]
          ${
            isVisible && !isExiting
              ? "animate-slide-in-bounce"
              : isExiting
              ? "animate-slide-out-smooth"
              : "opacity-0 -translate-y-8 scale-95"
          }
        `}
        style={{
          boxShadow: isVisible
            ? "0 25px 50px -12px rgba(74, 93, 120, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "none",
        }}
      >
        <div className="flex items-center gap-4 py-2 justify-center px-4 sm:px-6">
          <img src={Notify} alt="Notification" className="w-6 h-6" />
          <div className="flex-1">
            <p className="text-base font-bold text-right leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="relative w-full h-1 bg-white/15 rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute top-0 h-full bg-white 
                       transition-all duration-100 ease-linear 
                       shadow-sm rounded-full"
            style={{
              left: `${(100 - progress) / 2}%`,
              right: `${(100 - progress) / 2}%`,
              width: `${progress}%`,
            }}
          />

          <div
            className="absolute top-0 h-full bg-white/30 
                       rounded-full blur-[1px] 
                       transition-all duration-100 ease-linear"
            style={{
              left: `${(100 - progress) / 2}%`,
              right: `${(100 - progress) / 2}%`,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BidNotification;
