import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "../schemas/auth";
import { useAuth } from "../contexts/auth";
import { Button } from "../components/ui/button";
import { showToast } from "../utils/toast";
import { handleError } from "../utils/errorHandling";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Form } from "../components/ui/form";
import InputForm from "../components/ui/InputForm";

const Login = () => {
  const { login, loading } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ phoneNumber: data.phoneNumber, password: data.password });
      showToast.success("تم تسجيل الدخول بنجاح");
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <div
      className="min-h-screen flex bg-[#F3FAF7] items-center justify-center  p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md  border-0 bg-[#F3FAF7] overflow-hidden shadow-none">
        <CardHeader className="text-center space-y-4   rounded-t-lg p-4 pb-2 md:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <CardTitle className=" text-[#285240] text-2xl font-bold ">
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-[#5B5B5B] text-xl">
              يرجاء تسجيل بياناتك للدخول إلي لوحة التحكم
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="md:p-8 p-4 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InputForm<LoginFormData>
                control={form.control}
                name="phoneNumber"
                placeholder="أدخل رقم الهاتف"
                type="tel"
                disabled={loading}
                required
              />

              <InputForm<LoginFormData>
                control={form.control}
                name="password"
                placeholder="أدخل كلمة المرور"
                type="password"
                disabled={loading}
                required
              />

              <Button
                type="submit"
                className="w-full h-12 bg-[#285240] text-white  font-bold rounded-xl 
                 text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
