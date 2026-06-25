import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .nonempty("رقم الهاتف مطلوب")
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0-9]{9}$/, "رقم الهاتف غير صحيح"),
  password: z
    .string()
    .nonempty("كلمة المرور مطلوبة")
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
