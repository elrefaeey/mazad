import { z } from "zod";

// Helper function to convert Arabic numerals to English
const normalizeNumbers = (str: string): string => {
  const arabicToEnglish: { [key: string]: string } = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  return str.replace(/[٠-٩]/g, (char) => arabicToEnglish[char] || char);
};

// Egyptian phone number validation (01xxxxxxxxx format) - accepts both Arabic and English numerals
const phoneRegex = /^[٠0][١1][0-9٠-٩]{9}$/;

// Egyptian national ID validation (14 digits) - accepts both Arabic and English numerals
const nationalIdRegex = /^[0-9٠-٩]{14}$/;

export const bidderRegisterSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(phoneRegex, "رقم الهاتف يجب أن يكون بصيغة 01xxxxxxxxx")
    .transform(normalizeNumbers),
  national_id: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .regex(nationalIdRegex, "الرقم القومي يجب أن يكون 14 رقم")
    .transform(normalizeNumbers),
});

export const bidderLoginSchema = z.object({
  national_id: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .regex(nationalIdRegex, "الرقم القومي يجب أن يكون 14 رقم")
    .transform(normalizeNumbers),
});

export const bidderSignupSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(50, "الاسم يجب أن يكون أقل من 50 حرف"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(phoneRegex, "رقم الهاتف يجب أن يكون بصيغة 01xxxxxxxxx")
    .transform(normalizeNumbers),
  national_id: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .regex(nationalIdRegex, "الرقم القومي يجب أن يكون 14 رقم")
    .transform(normalizeNumbers),
  auction_id: z.string().optional(),
});

export type BidderLoginFormData = z.infer<typeof bidderLoginSchema>;
export type BidderSignupFormData = z.infer<typeof bidderSignupSchema>;
