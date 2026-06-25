import { Button } from "../components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoutConfirmDialog from "./ui/LogoutConfirmDialog";
import { useAuctionData } from "../hooks/useAuctionData";
import { useAuctionTimer } from "../hooks/useAuctionTimer";
import MazadSquareLogo from "../assets/nav-logo.png";
import { useBidderAuth } from "../contexts/bidderAuth";
import MobileMenu from "./Client/MobileMenu";
import AuctionTimer from "./Client/AuctionTimer";
import { Menu } from "lucide-react";
import { handleContactNavigation, scrollToHashSection } from "../utils";

const links: Array<{ path: string; label: string; authRequired?: boolean }> = [
  { path: "/home", label: "الرئيسية" },
  { path: "/my-bids", label: "سجل المزايدات", authRequired: true },
  { path: "/refund-policy", label: "سياسة الاسترجاع" },
  { path: "/privacy-policy", label: "سياسة الخصوصية" },
  { path: "#contactus", label: "اتصل بنا" },
];
function ClientNavbar() {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { isAuthenticated, logout } = useBidderAuth();

  const { auctionData } = useAuctionData();
  const { timeLeft, isExpired } = useAuctionTimer(
    auctionData?.data?.auction?.endDate || null
  );

  const showTimer =
    location.pathname.startsWith("/units/") &&
    !location.pathname.startsWith("/auction");

  const name = auctionData?.data?.auction?.name || "";

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  // Handle scroll to contact section
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleContactNavigation(location.pathname, navigate);
  };

  // Check if URL has hash on mount or location change
  useEffect(() => {
    if (location.hash) {
      scrollToHashSection(location.hash);
    }
  }, [location]);

  return (
    <>
      <div className="bg-[#FEFEFE] text-white">
        <div className="container">
          <div className="flex items-center justify-between py-3 type-small border-b border-white/10">
            <div className="flex items-center lg:flex-row flex-row-reverse justify-between w-full gap-4">
              <img
                src={MazadSquareLogo}
                alt="Mazad logo"
                className="w-12 sm:w-14  flex-shrink-0"
              />

              <div className="hidden lg:flex items-center gap-6 xl:gap-10">
                {links
                  .filter((link) => !link.authRequired || isAuthenticated)
                  .map((link) => {
                    const isActive = location.pathname === link.path;
                    const isContactLink = link.path === "#contactus";

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={isContactLink ? handleContactClick : undefined}
                        className={`type-small transition-colors duration-200 whitespace-nowrap ${
                          isActive
                            ? "text-[#285240] font-medium"
                            : "text-[#6B7280] hover:text-[#285240]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
              </div>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() => navigate("/signup")}
                      className="text-white px-8 py-3 rounded-xl"
                    >
                      سجل الان
                    </Button>
                    <Button
                      onClick={() => navigate("/login")}
                      className="px-8 py-3 rounded-xl bg-transparent text-[#6B7280] border-[#E6E6E6] border"
                    >
                      تسجيل دخول
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleLogout}
                    className="px-8 py-3 rounded-xl bg-transparent text-[#6B7280] border-[#E6E6E6] border"
                  >
                    خروج
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-[#285240]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={links}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Timer Section */}
      {showTimer && (
        <AuctionTimer
          timeLeft={timeLeft}
          isExpired={isExpired}
          auctionName={name}
        />
      )}

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد من تسجيل الخروج من المزاد؟"
      />
    </>
  );
}

export default ClientNavbar;
