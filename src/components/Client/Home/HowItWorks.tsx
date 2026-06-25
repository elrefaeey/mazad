import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "اختر الوحدة",
    description: "تصفح الوحدات المتاحة وحدد ما يناسبك من حيث المساحة والموقع.",
  },
  {
    id: 2,
    title: "اختر نسبة المقدم",
    description: "كلما زادت نسبة المقدم، قلت قيمة سعر المتر النهائي.",
  },
  {
    id: 3,
    title: "احصل على السعر الأفضل",
    description: "وقّع العقد واستكمل الإجراءات بسهولة وبنظام مُحكم شفاف.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-section"
      className="py-8 lg:py-16 bg-white text-center overflow-hidden"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="type-heading text-[#285240] mb-2">
            كيف تعمل المنصة؟
          </h2>
          <p className="type-body text-[#6B7280] mb-5 lg:mb-10">
            ثلاث خطوات بسيطة لتصل إلى أفضل سعر للمتر
          </p>
        </motion.div>
      </div>

      <motion.div
        className="container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.75,
            },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {steps.map((step) => (
          <motion.div
            key={step.id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative group overflow-hidden border border-[#E6E6E6] rounded-2xl shadow-sm transition-all duration-500 hover:shadow-lg h-full">
              <span className="absolute bottom-0 right-0 w-0 h-0 bg-[#285240] transition-all rounded-2xl duration-700 ease-in-out group-hover:w-full group-hover:h-full"></span>

              <div className="relative z-10 px-5 py-7 sm:px-6 sm:py-8 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:text-white min-h-[200px] sm:min-h-[220px]">
                <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#285240] text-white text-lg font-bold mb-3 transition-all duration-500 group-hover:bg-white group-hover:text-[#285240]">
                  {step.id}
                </div>
                <h3 className="type-subheading text-[#285240] mb-2 transition-all duration-500 group-hover:text-white">
                  {step.title}
                </h3>
                <p className="type-body text-[#6B7280] max-w-[240px] leading-relaxed transition-all duration-500 group-hover:text-gray-100">
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
