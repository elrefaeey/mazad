import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/auth";
import LogoutConfirmDialog from "./ui/LogoutConfirmDialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setPopoverOpen(false);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
    setShowLogoutDialog(false);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const navItems = [
    { path: "/admin/auctions", label: "الرئيسية" },
    { path: "/admin/deposits", label: "المدفوعات" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className=" bg-[#285240] sticky top-0 rounded-b-3xl z-50">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-3 space-x-4 rtl:space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse ${
                    isActive(item.path)
                      ? "bg-primary text-white "
                      : "text-gray-400 hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {admin && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center bg-white text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-48 p-2 bg-white border-none"
                    align="end"
                  >
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      تسجيل الخروج
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="md:hidden mr-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2
               rounded-md  hover:text-gray-500 text-white hover:bg-gray-100 bg-transparent
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse ${
                      isActive(item.path)
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-200 hover:text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {admin && (
                <motion.div
                  className="border-t pt-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse px-3 py-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-base text-gray-700">
                      {admin.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 text-base font-medium text-red-600  rounded-md flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل خروج</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        title="تسجيل الخروج"
        message="هل أنت متأكد من تسجيل الخروج من لوحة الإدارة؟"
      />
    </nav>
  );
};

export default Navbar;
