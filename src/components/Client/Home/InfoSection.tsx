import { motion } from "framer-motion";
import { useBidderAuth } from "../../../contexts/bidderAuth";
import { Link } from "react-router-dom";

function InfoSection() {
  const { isAuthenticated } = useBidderAuth();

  return (
    <section id="contactus" className="bg-[#F4F7F5] py-8 sm:py-10">
      <div className="container">
        <motion.div
          className="rounded-2xl bg-[#285240] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center lg:text-right flex-1">
            <h3 className="type-heading text-white leading-snug">
              الفرصة الآن لتملك وحدتك بأذكى طريقة في السوق
            </h3>
            <p className="type-body text-white/80 mt-3 max-w-xl lg:mr-0 mx-auto">
              سجّل مجاناً وابدأ بالمزايدة على نسبة المقدم لتحصل على سعر متر أقل
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="https://wa.me/201070015512"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/60 hover:border-white hover:bg-white/10 rounded-xl text-white px-8 py-3 type-body font-medium text-center transition-colors"
            >
              تواصل معنا
            </a>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="bg-[#FBCD01] hover:bg-[#e8be00] rounded-xl text-[#1a3329] px-8 py-3 type-body font-semibold text-center transition-colors"
              >
                سجل مجاناً
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default InfoSection;
