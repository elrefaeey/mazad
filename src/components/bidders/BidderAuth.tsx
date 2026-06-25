import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import InputForm from "../ui/InputForm";
import { bidderRegisterSchema } from "../../schemas/bidders";
import { useBidderRegister } from "../../hooks/bidders/useBidderRegister";
import { useBidderLogin } from "../../hooks/bidders/useBidderLogin";
import { BidderFormData } from "../../types/bidders";
import { useNavigate } from "react-router-dom";

type Props = {
  auctionId: string;
  onSuccess: () => void;
};

type FormMode = "register" | "login";

type LoginFormData = {
  national_id: string;
};

function BidderAuth({ auctionId, onSuccess }: Props) {
  const [mode, setMode] = useState<FormMode>("register");
  const navigate = useNavigate();
  const registerForm = useForm<BidderFormData>({
    resolver: zodResolver(bidderRegisterSchema),
    defaultValues: {
      name: "",
      phone: "",
      national_id: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(
      z.object({
        national_id: z
          .string()
          .min(1, "الرقم القومي مطلوب")
          .length(14, "الرقم القومي يجب أن يكون 14 رقم"),
      })
    ),
    defaultValues: {
      national_id: "",
    },
    mode: "onChange",
  });

  const { mutate: register, isPending: isRegistering } =
    useBidderRegister(onSuccess);
  const { mutate: login, isPending: isLoggingIn } = useBidderLogin(onSuccess);

  const onRegisterSubmit = (data: BidderFormData) => {
    register({
      ...data,
      auction_id: auctionId,
    });
  };

  const onLoginSubmit = (data: LoginFormData) => {
    if (!auctionId) {
      return;
    }

    login({
      national_id: data.national_id,
      auction_id: auctionId,
    });
  };

  const isLoading = isRegistering || isLoggingIn;

  return (
    <div className="min-h-[calc(100vh_-_73px)] flex items-center justify-center py-12 px-3 md:px-4">
      <div className="w-full max-w-md  rounded-xl p-4">
        <div className="text-center my-4">
          <CardTitle className="type-heading text-[#285240]">
            {mode === "register" ? "تسجيل الدخول" : "تسجيل دخول مشارك"}
          </CardTitle>
          <p className="text-[#5B5B5B] mt-2 type-body">
            {mode === "register"
              ? "من فضلك أدخل بياناتك للمشاركة في المزاد العقاري."
              : "أدخل الرقم القومي لتسجيل الدخول"}
          </p>
        </div>

        <div>
          {mode === "register" ? (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4"
              >
                <InputForm<BidderFormData>
                  control={registerForm.control}
                  name="name"
                  placeholder="أدخل الاسم الكامل"
                  type="text"
                  disabled={isLoading}
                  required
                />

                <InputForm<BidderFormData>
                  control={registerForm.control}
                  name="phone"
                  placeholder="رقم الهاتف"
                  type="tel"
                  disabled={isLoading}
                  required
                />

                <InputForm<BidderFormData>
                  control={registerForm.control}
                  name="national_id"
                  placeholder="الرقم القومي"
                  type="text"
                  disabled={isLoading}
                  required
                />

                <Button
                  type="submit"
                  className="w-full !bg-[#285240] text-white type-body rounded-xl py-[6px]"
                  disabled={isLoading}
                >
                  {isRegistering ? "جاري التسجيل..." : "تسجيل"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <input
                    {...loginForm.register("national_id")}
                    placeholder="أدخل الرقم القومي (14 رقم)"
                    type="text"
                    disabled={isLoading}
                    className="bg-[#28524042] text-[#285240A1] placeholder:text-[#285240A1]
                     border-none font-din-arabic type-body rounded-xl transition-all duration-300 w-full outline-none ring-0 focus:ring-2 focus:ring-[#285240] focus:outline-none px-3 py-6 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    dir="rtl"
                  />
                  {loginForm.formState.errors.national_id && (
                    <p className="text-red-500 mt-1 text-sm font-medium">
                      {loginForm.formState.errors.national_id.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full !bg-[#285240] text-white !py-[6px] type-body rounded-xl"
                  disabled={isLoading}
                >
                  {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-3 text-center flex flex-col ">
            <Button
              variant="ghost"
              className="text-[#5B5B5B] type-body hover:bg-transparent shadow-none"
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                registerForm.reset();
                loginForm.reset();
              }}
              disabled={isLoading}
            >
              {mode === "register"
                ? "لديك حساب؟ تسجيل دخول"
                : "مشارك جديد؟ إنشاء حساب"}
            </Button>
            <Button
              className="shadow-none underline underline-[#D9B412] text-[#D9B412] bg-transparent type-body"
              onClick={() => navigate("/home")}
            >
              الدخول كضيف
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidderAuth;
