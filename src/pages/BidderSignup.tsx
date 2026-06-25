import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";
import { Form } from "../components/ui/form";
import InputForm from "../components/ui/InputForm";
import { bidderSignupSchema, BidderSignupFormData } from "../schemas/bidders";
import { useBidderRegister } from "../hooks/bidders/useBidderRegister";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBidderAuth } from "../contexts/bidderAuth";
import { BidderRegisterRequest } from "../types/bidders";

function BidderSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUnit = searchParams.get("redirect_unit");
  const { isAuthenticated } = useBidderAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUnit) {
        navigate(`/units/${redirectUnit}`);
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, navigate, redirectUnit]);

  const registerForm = useForm<BidderSignupFormData>({
    resolver: zodResolver(bidderSignupSchema),
    defaultValues: {
      name: "",
      phone: "",
      national_id: "",
      auction_id: "",
    },
  });

  const { mutate: register, isPending: isRegistering } = useBidderRegister(
    () => {
      if (redirectUnit) {
        navigate(`/unit/${redirectUnit}`);
      } else {
        navigate("/home");
      }
    }
  );

  const onRegisterSubmit = (data: BidderSignupFormData) => {
    const registerData: BidderRegisterRequest = {
      name: data.name,
      phone: data.phone,
      national_id: data.national_id,
    };

    if (data.auction_id) {
      registerData.auction_id = data.auction_id;
    }

    register(registerData);
  };

  return (
    <div className="min-h-screen bg-[#F3FAF7] flex items-center justify-center py-12 px-3 md:px-4">
      <div className="w-full max-w-md rounded-xl p-4">
        <div className="text-center my-4">
          <CardTitle className="type-heading text-[#285240]">
            تسجيل حساب جديد
          </CardTitle>
          <p className="text-[#5B5B5B] mt-2 type-body">
            من فضلك أدخل بياناتك للمشاركة في المزاد العقاري
          </p>
        </div>

        <div>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <InputForm<BidderSignupFormData>
                control={registerForm.control}
                name="name"
                placeholder="أدخل الاسم الكامل"
                type="text"
                disabled={isRegistering}
                required
              />

              <InputForm<BidderSignupFormData>
                control={registerForm.control}
                name="phone"
                placeholder="رقم الهاتف"
                type="tel"
                disabled={isRegistering}
                required
              />

              <InputForm<BidderSignupFormData>
                control={registerForm.control}
                name="national_id"
                placeholder="الرقم القومي"
                type="text"
                disabled={isRegistering}
                required
              />

              <Button
                type="submit"
                className="w-full !bg-[#285240] text-white text-base rounded-xl py-[6px] type-body"
                disabled={isRegistering}
              >
                {isRegistering ? "جاري التسجيل..." : "تسجيل"}
              </Button>
            </form>
          </Form>

          <div className="mt-3 text-center flex flex-col">
            <Button
              variant="ghost"
              className="text-[#5B5B5B] type-body hover:bg-transparent shadow-none"
              onClick={() => {
                const params = new URLSearchParams();
                if (redirectUnit) params.append("redirect_unit", redirectUnit);
                navigate(
                  `/login${params.toString() ? `?${params.toString()}` : ""}`
                );
              }}
              disabled={isRegistering}
            >
              لديك حساب؟
              <span className="underline">تسجيل دخول</span>{" "}
            </Button>
            <Button
              className="shadow-none underline underline-[#D9B412] text-[#D9B412] bg-transparent type-body hover:bg-transparent"
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

export default BidderSignup;
