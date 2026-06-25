import { useLocation, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import MazadLogo from "../../assets/mazad-square.svg";
import { handleContactNavigation } from "../../utils/scrollToSection";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleContactNavigation(location.pathname, navigate);
  };

  return (
    <footer className="bg-[#1a3329] text-white">
      <div className="container py-8 sm:py-10 flex flex-col items-center text-center">
        <img
          src={MazadLogo}
          alt="Mazad Logo"
          className="w-20 sm:w-24 object-contain mb-4"
        />

        <p className="type-small text-white/80 max-w-md leading-relaxed mb-5">
          مزاد عقاري ذكي لتوفير أفضل سعر متر للمستثمرين والمشترين
        </p>

        <button
          type="button"
          onClick={onContactClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/50 text-white type-small font-semibold hover:bg-white/10 hover:border-white transition-colors mb-5"
        >
          <Phone className="w-4 h-4" />
          اتصل بنا
        </button>

        <a
          href="mailto:Finance@mazzad.ai"
          className="type-small text-white/60 hover:text-white/90 transition-colors mb-5"
          dir="ltr"
        >
          Finance@mazzad.ai
        </a>

        <p className="type-caption text-white/40 pt-4 border-t border-white/10 w-full max-w-md">
          © 2026 Mazad — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
};

export default Footer;
