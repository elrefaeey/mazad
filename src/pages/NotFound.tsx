import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Home, Search } from "lucide-react";

function NotFound() {
  const numberVariants = {
    hidden: { opacity: 0, y: 50, rotate: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    }),
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 },
    },
  };

  // أنيميشن النص
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.8, duration: 0.6 },
    },
  };

  // أنيميشن الأزرار
  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.2,
        staggerChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // أنيميشن الخلفية
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fffe] via-white to-[#e8f5f2] flex items-center justify-center px-4 overflow-hidden relative">
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-[#285240] opacity-5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-80 h-80 bg-[#FBCD01] opacity-5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          className="flex justify-center mb-8"
          variants={floatingVariants}
          animate="animate"
        >
          <motion.div
            className="bg-[#28524015] p-6 rounded-full"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Search className="w-16 h-16 text-[#285240]" />
          </motion.div>
        </motion.div>

        {/* الأرقام 404 */}
        <div className="flex justify-center items-center gap-4 mb-8" dir="ltr">
          {["4", "0", "4"].map((num, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={numberVariants}
              className="text-[120px] sm:text-[160px] md:text-[200px] font-bold text-[#285240] 
                       leading-none cursor-pointer select-none"
              style={{
                textShadow: "4px 4px 0px rgba(40, 82, 64, 0.1)",
              }}
            >
              {num}
            </motion.div>
          ))}
        </div>

        {/* النصوص */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#262626] mb-4">
            عذراً، الصفحة غير موجودة
          </h1>
          <p className="text-lg sm:text-xl text-[#5B5B5B] max-w-2xl mx-auto">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
          </p>
        </motion.div>

        {/* الأزرار */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonContainerVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/home">
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                className="bg-[#285240] hover:bg-[#153628] text-white px-8 py-2
                         text-lg rounded-xl shadow-lg flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </Button>
            </motion.div>
          </Link>

    
        </motion.div>


      </div>
    </div>
  );
}

export default NotFound;
