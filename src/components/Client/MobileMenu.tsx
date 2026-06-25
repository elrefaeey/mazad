import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { handleContactNavigation } from "../../utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: Array<{ path: string; label: string; authRequired?: boolean }>;
  isAuthenticated: boolean;
  onLogout: () => void;
}

function MobileMenu({
  isOpen,
  onClose,
  links,
  isAuthenticated,
  onLogout,
}: MobileMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.3,
      },
    }),
  };

  const handleLinkClick = (path: string) => {
    if (path === "#contactus") {
      handleContactNavigation(location.pathname, navigate, onClose);
    } else {
      navigate(path);
      onClose();
    }
  };

  const handleAuthAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar Menu */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#285240]">القائمة</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {links
                    .filter((link) => !link.authRequired || isAuthenticated)
                    .map((link, index) => {
                      const isActive = location.pathname === link.path;

                      return (
                        <motion.div
                          key={link.path}
                          custom={index}
                          variants={itemVariants}
                        >
                          <button
                            onClick={() => handleLinkClick(link.path)}
                            className={`w-full text-right px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-[#285240] text-white font-medium"
                                : "text-[#6B7280] hover:bg-gray-100"
                            }`}
                          >
                            {link.label}
                          </button>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </nav>

              {/* Auth Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 border-t border-gray-200 space-y-2"
              >
                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={() =>
                        handleAuthAction(() => navigate("/signup"))
                      }
                      className="w-full text-white px-8 py-3 rounded-xl"
                    >
                      سجل الان
                    </Button>
                    <Button
                      onClick={() => handleAuthAction(() => navigate("/login"))}
                      className="w-full px-8 py-3 rounded-xl bg-transparent text-[#6B7280] border-[#E6E6E6] border"
                    >
                      تسجيل دخول
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleAuthAction(onLogout)}
                    className="w-full px-8 py-3 rounded-xl bg-transparent text-[#6B7280] border-[#E6E6E6] border"
                  >
                    خروج
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
