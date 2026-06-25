import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";
import { Form } from "../components/ui/form";
import InputForm from "../components/ui/InputForm";
import { bidderLoginSchema, BidderLoginFormData } from "../schemas/bidders";
import { useBidderLogin } from "../hooks/bidders/useBidderLogin";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBidderAuth } from "../contexts/bidderAuth";
import { BidderLoginRequest } from "../types/bidders";

function BidderLogin() {
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

  const loginForm = useForm<BidderLoginFormData>({
    resolver: zodResolver(bidderLoginSchema),
    defaultValues: {
      national_id: "",
    },
    mode: "onChange",
  });

  const { mutate: login, isPending: isLoggingIn } = useBidderLogin(() => {
    if (redirectUnit) {
      navigate(`/unit/${redirectUnit}`);
    } else {
      navigate("/home");
    }
  });

  const onLoginSubmit = (data: BidderLoginFormData) => {
    const loginData: BidderLoginRequest = {
      national_id: data.national_id,
    };

    login(loginData);
  };

  return (
    <div className="min-h-screen bg-[#F3FAF7] flex items-center justify-center py-12 px-3 md:px-4">
      <div className="w-full max-w-md rounded-xl p-4">
        <div className="text-center my-4">
          <CardTitle className="type-heading text-[#285240]">
            تسجيل دخول مشارك
          </CardTitle>
          <p className="text-[#5B5B5B] mt-2 type-body">
            أدخل الرقم القومي لتسجيل الدخول
          </p>
        </div>

        <div>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <InputForm<BidderLoginFormData>
                control={loginForm.control}
                name="national_id"
                placeholder="أدخل الرقم القومي (14 رقم)"
                type="text"
                disabled={isLoggingIn}
                required
              />

              <Button
                type="submit"
                className="w-full !bg-[#285240] text-white !py-[6px] type-body rounded-xl"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
              </Button>
            </form>
          </Form>

          <div className="mt-3 text-center flex flex-col">
            <Button
              variant="ghost"
              className="text-[#5B5B5B] type-body hover:bg-transparent shadow-none"
              onClick={() =>
                navigate(
                  redirectUnit ? `/signup?redirect_unit=${redirectUnit}` : "/signup"
                )
              }
              disabled={isLoggingIn}
            >
              مشارك جديد؟
              <span className="underline"> إنشاء حساب</span>
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

export default BidderLogin;
