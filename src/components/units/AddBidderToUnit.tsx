import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormModal from "../ui/FormModal";
import InputForm from "../ui/InputForm";
import { Form } from "../ui/form";
import { useAddBidderToUnit } from "../../hooks/units/useAddBidderToUnit";
import { useUnitAvailableAdvances } from "../../hooks/units/useUnitAvailableAdvances";

const addBidderSchema = z.object({
  name: z
    .string()
    .min(1, "الاسم مطلوب")
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(100, "الاسم يجب أن يكون أقل من 100 حرف"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح"),
  national_id: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .regex(/^[0-9]{14}$/, "الرقم القومي يجب أن يكون 14 رقم"),
  advance_id: z.string().min(1, "يجب اختيار نسبة المقدم"),
});

type AddBidderFormData = z.infer<typeof addBidderSchema>;

type Props = {
  unitId: string;
  children: React.ReactElement;
  onSuccess?: () => void;
};

function AddBidderToUnit({ unitId, children, onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Fetch available advances
  const { data: advancesData, isLoading: loadingAdvances } =
    useUnitAvailableAdvances(unitId);

  const defaultValues: Partial<AddBidderFormData> = {
    name: "",
    phone: "",
    national_id: "",
    advance_id: "",
  };

  const form = useForm<AddBidderFormData>({
    resolver: zodResolver(addBidderSchema),
    defaultValues,
  });

  const onClose = () => {
    setIsOpen(false);
    form.reset(defaultValues);
  };

  const { mutate: addBidder, isPending: isAdding } = useAddBidderToUnit(
    unitId,
    () => {
      onClose();
      onSuccess?.();
    }
  );

  const onSubmit = (data: AddBidderFormData) => {
    // Find the selected advance to get its details
    const response = advancesData as {
      data?: {
        available_advances?: Array<{ value: number; price_per_meter: number }>;
      };
    };
    const selectedAdvance = response?.data?.available_advances?.find(
      (_: unknown, index: number) => index.toString() === data.advance_id
    );

    if (!selectedAdvance) {
      console.error("Selected advance not found");
      return;
    }

    addBidder({
      name: data.name,
      phone: data.phone,
      national_id: data.national_id,
      advance_value: selectedAdvance.value,
      price_per_meter: selectedAdvance.price_per_meter,
    });
  };

  // Get available advances for dropdown
  const response = advancesData as {
    data?: {
      available_advances?: Array<{
        value: number;
        price_per_meter: number;
        payment_duration?: string;
      }>;
    };
  };
  const availableAdvances = response?.data?.available_advances || [];

  return (
    <>
      {React.cloneElement(children, {
        onClick: () => setIsOpen(true),
      })}

      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title="إضافة مزايد للوحدة"
        onSubmit={form.handleSubmit(onSubmit)}
        submitLoading={isAdding}
        txtBtn={isAdding ? "جاري الإضافة..." : "إضافة مزايد"}
        describedby="add-bidder-form"
        disabled={loadingAdvances}
      >
        <Form {...form}>
          <div className="space-y-4" id="add-bidder-form">
            <InputForm
              control={form.control}
              name="name"
              label="اسم المزايد"
              placeholder="أدخل اسم المزايد"
            />

            <InputForm
              control={form.control}
              name="phone"
              label="رقم الهاتف"
              placeholder="01xxxxxxxxx"
            />

            <InputForm
              control={form.control}
              name="national_id"
              label="الرقم القومي"
              placeholder="14 رقم"
            />

            {/* Advance Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                نسبة المقدم
              </label>
              <div className="relative">
                <select
                  {...form.register("advance_id")}
                  className={`
                    w-full px-3 py-2 pr-2 border rounded-md shadow-sm bg-white
                    ${
                      form.formState.errors.advance_id
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    }
                    focus:outline-none focus:ring-1
                  `}
                  disabled={loadingAdvances || availableAdvances.length === 0}
                >
                  <option value="">
                    {loadingAdvances
                      ? "جاري التحميل..."
                      : availableAdvances.length === 0
                      ? "لا توجد مقدمات متاحة"
                      : "اختر نسبة المقدم"}
                  </option>
                  {availableAdvances.map((advance, index) => (
                    <option key={index} value={index.toString()}>
                      {advance.value}% -{" "}
                      {advance.price_per_meter.toLocaleString()} جنيه/متر
                      {advance.payment_duration &&
                        ` - ${advance.payment_duration}`}
                    </option>
                  ))}
                </select>
              </div>
              {form.formState.errors.advance_id && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.advance_id.message}
                </p>
              )}
            </div>
          </div>
        </Form>
      </FormModal>
    </>
  );
}

export default AddBidderToUnit;
