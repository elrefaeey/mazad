import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Minus, Upload, X, Image as ImageIcon } from "lucide-react";
import FormModal from "../ui/FormModal";
import InputForm from "../ui/InputForm";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Unit } from "../../types/auctions";
import { useCreateUnit } from "../../hooks/units/useCreateUnit";
import { useUpdateUnit } from "../../hooks/units/useUpdateUnit";

const advanceSchema = z.object({
  value: z
    .string()
    .min(1, "النسبة مطلوبة")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "النسبة يجب أن تكون رقم موجب",
    })
    .refine((val) => Number(val) <= 100, {
      message: "النسبة لا يمكن أن تتجاوز 100%",
    }),
  price_per_meter: z
    .string()
    .min(1, "سعر المتر مطلوب")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "سعر المتر يجب أن يكون رقم موجب",
    }),
  payment_duration: z.string().min(1, "فترة السداد مطلوبة"),
});

const unitSchema = z.object({
  unit_number: z.string().min(1, "رقم الوحدة مطلوب"),
  area: z
    .string()
    .min(1, "المساحة مطلوبة")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "المساحة يجب أن تكون رقم موجب",
    }),
  recieve_duration: z.string().min(1, "فترة الاستلام مطلوبة"),
  specs: z
    .string()
    .min(1, "مواصفات الوحدة مطلوبة")
    .min(3, "المواصفات يجب أن تكون 3 أحرف على الأقل"),
  starting_price_per_meter: z
    .string()
    .min(1, "سعر المتر الافتتاحي مطلوب")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "سعر المتر يجب أن يكون رقم موجب",
    }),
  advances: z
    .array(advanceSchema)
    .min(1, "يجب إضافة مقدم واحد على الأقل")
    .refine(
      (advances) => {
        for (let i = 1; i < advances.length; i++) {
          if (Number(advances[i].value) <= Number(advances[i - 1].value)) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "نسب المقدمات يجب أن تكون مرتبة تصاعدياً (كل مقدم أكبر من السابق)",
      }
    )
    .refine(
      (advances) => {
        for (let i = 1; i < advances.length; i++) {
          if (
            Number(advances[i].price_per_meter) >=
            Number(advances[i - 1].price_per_meter)
          ) {
            return false;
          }
        }
        return true;
      },
      {
        message:
          "أسعار المتر يجب أن تكون مرتبة تنازلياً (كل سعر أقل من السابق)",
      }
    ),
  image: z.any().optional(),
  mainImage: z.any().optional(),
});

type UnitFormData = z.infer<typeof unitSchema>;

type Props = {
  auctionId: string;
  editedUnit?: Unit;
  children: React.ReactElement;
  onSuccess?: () => void;
};

function CreateEditUnit({ auctionId, editedUnit, children, onSuccess }: Props) {
  const [open, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editedUnit?.image || null
  );
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(
    editedUnit?.mainImage || null
  );
  const [isDragActive] = useState(false);
  const [isMainImageDragActive] = useState(false);
  // حالة لتتبع ما إذا كانت الصور تم تغييرها
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isMainImageChanged, setIsMainImageChanged] = useState(false);

  const defaultValues: UnitFormData = {
    unit_number: editedUnit?.unit_number ?? "",
    area: editedUnit?.area ? String(editedUnit.area) : "",
    specs: editedUnit?.specs ?? "",
    recieve_duration: editedUnit?.recieve_duration ?? "",
    starting_price_per_meter: editedUnit?.startPrice
      ? String(editedUnit.startPrice)
      : "",
    advances: editedUnit?.advances
      ? editedUnit.advances.map((adv) => ({
          value: String(adv.value),
          price_per_meter: String(adv.price_per_meter),
          payment_duration: adv.payment_duration || "",
        }))
      : [{ value: "", price_per_meter: "", payment_duration: "" }],
    image: null,
    mainImage: null,
  };

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "advances",
  });
  const {
    formState: { errors },
  } = form;
  const onClose = () => {
    setIsOpen(false);
    form.reset();
    setImagePreview(editedUnit?.image || null);
    setMainImagePreview(editedUnit?.mainImage || null);
    setIsImageChanged(false);
    setIsMainImageChanged(false);
  };

  const { mutate: createUnit, isPending: isCreating } = useCreateUnit(
    auctionId,
    () => {
      onClose();
      onSuccess?.();
    }
  );

  const { mutate: updateUnit, isPending: isUpdating } = useUpdateUnit(
    auctionId,
    () => {
      onClose();
      onSuccess?.();
    }
  );

  const onOpen = () => {
    setIsOpen(true);
    form.reset(defaultValues);
    setImagePreview(editedUnit?.image || null);
    setMainImagePreview(editedUnit?.mainImage || null);
    setIsImageChanged(false);
    setIsMainImageChanged(false);
  };

  const onSubmit = async (data: UnitFormData) => {
    try {
      const submitData = {
        unit_number: data.unit_number,
        area: data.area,
        specs: data.specs,
        recieve_duration: data.recieve_duration,
        starting_price_per_meter: data.starting_price_per_meter,
        advances: data.advances,
        // إرسال الصور فقط إذا تم تغييرها
        ...(data.image && { image: data.image }),
        ...(data.mainImage && { mainImage: data.mainImage }),
      };

      if (editedUnit) {
        updateUnit({
          ...submitData,
          id: editedUnit.id,
          advances: submitData.advances.map((adv) => ({
            value: Number(adv.value),
            price_per_meter: Number(adv.price_per_meter),
            payment_duration: adv.payment_duration,
          })),
        });
      } else {
        createUnit({
          ...submitData,
          advances: submitData.advances.map((adv) => ({
            value: Number(adv.value),
            price_per_meter: Number(adv.price_per_meter),
            payment_duration: adv.payment_duration,
          })),
        });
      }
    } catch (error) {
      console.error("Error submitting unit:", error);
    }
  };

  const addAdvance = () => {
    append({ value: "", price_per_meter: "", payment_duration: "" });
  };

  const removeAdvance = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleImageChange = (file: File) => {
    // التحقق من حجم الملف (10MB كحد أقصى)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("حجم الصورة كبير جداً. الحد الأقصى 10MB");
      return;
    }

    // التحقق من نوع الملف
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG, PNG, GIF أو WebP"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    form.setValue("image", file);
    setIsImageChanged(true);
  };

  const handleMainImageChange = (file: File) => {
    // التحقق من حجم الملف (10MB كحد أقصى)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("حجم الصورة كبير جداً. الحد الأقصى 10MB");
      return;
    }

    // التحقق من نوع الملف
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "نوع الملف غير مدعوم. يرجى اختيار صورة بصيغة JPG, PNG, GIF أو WebP"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setMainImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    form.setValue("mainImage", file);
    setIsMainImageChanged(true);
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("image", null);
    setIsImageChanged(editedUnit?.image ? true : false);
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
    form.setValue("mainImage", null);
    setIsMainImageChanged(editedUnit?.mainImage ? true : false);
  };

  const isLoading = isCreating || isUpdating;

  return (
    <>
      {React.cloneElement(children, {
        onClick: onOpen,
      })}

      <FormModal
        describedby="فورم إضافة وتعديل الوحدات"
        title={!editedUnit ? "إضافة وحدة جديدة" : "تعديل بيانات الوحدة"}
        txtBtn={!editedUnit ? "إضافة الوحدة" : "تعديل الوحدة"}
        submitLoading={isLoading}
        isOpen={open}
        onClose={onClose}
        disabled={isLoading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <div className="space-y-6">
            <InputForm<UnitFormData>
              control={form.control}
              name="unit_number"
              placeholder="أدخل رقم الوحدة"
              type="text"
              disabled={isLoading}
              required
            />

            <InputForm<UnitFormData>
              control={form.control}
              name="area"
              placeholder="أدخل المساحة بالمتر المربع"
              type="text"
              disabled={isLoading}
              required
            />

            <InputForm<UnitFormData>
              control={form.control}
              name="specs"
              placeholder="أدخل مواصفات الوحدة"
              type="textarea"
              disabled={isLoading}
              required
            />

            <InputForm<UnitFormData>
              control={form.control}
              name="recieve_duration"
              placeholder="أدخل فترة الاستلام"
              type="text"
              disabled={isLoading}
              required
            />

            <InputForm<UnitFormData>
              control={form.control}
              name="starting_price_per_meter"
              placeholder="أدخل سعر المتر الافتتاحي"
              type="text"
              disabled={isLoading}
              required
            />

            <div className="space-y-4">
              <label className="text-sm font-medium text-[#262626]">
                المقدمات <span className="text-red-500">*</span>
              </label>

              {errors.advances?.root && (
                <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  {errors.advances.root.message}
                </div>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 p-3 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">
                        مقدم {index + 1}
                      </h4>
                      <div className="flex items-center gap-2">
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeAdvance(index)}
                            className="w-6 h-6 bg-[#B3B3B3] rounded-full
                              transition-colors
                               flex items-center justify-center p-0"
                            disabled={isLoading}
                          >
                            <Minus className="w-4 h-4 text-[#E2112C]" />
                          </Button>
                        )}
                        {index === fields.length - 1 && (
                          <Button
                            type="button"
                            onClick={addAdvance}
                            className="w-6 h-6 bg-[#B3B3B3]
                             text-white rounded-full
                               transition-colors flex items-center justify-center p-0"
                            disabled={isLoading}
                          >
                            <Plus className="w-4 h-4 text-[#159D15]" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <InputForm<UnitFormData>
                        control={form.control}
                        name={`advances.${index}.value` as keyof UnitFormData}
                        placeholder="النسبة %"
                        type="text"
                        disabled={isLoading}
                        min={1}
                        max={100}
                      />

                      <InputForm<UnitFormData>
                        control={form.control}
                        name={
                          `advances.${index}.price_per_meter` as keyof UnitFormData
                        }
                        placeholder="سعر المتر"
                        type="text"
                        disabled={isLoading}
                        min={1}
                      />

                      <InputForm<UnitFormData>
                        control={form.control}
                        name={
                          `advances.${index}.payment_duration` as keyof UnitFormData
                        }
                        placeholder="فترة السداد"
                        type="text"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#262626] block mb-2">
                صورة الوحدة
              </label>

              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="معاينة الصورة"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        disabled={isLoading}
                        title="حذف الصورة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-medium">
                          صورة الوحدة
                        </p>
                        {editedUnit && !isImageChanged && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            صورة موجودة
                          </span>
                        )}
                        {isImageChanged && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                            {editedUnit ? "تم التغيير" : "جديدة"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!imagePreview && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                      id="image-upload"
                    />
                    <div
                      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        isDragActive
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload
                            className={`w-8 h-8 mb-4 ${
                              isDragActive ? "text-blue-500" : "text-gray-500"
                            }`}
                          />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              {isDragActive
                                ? "أفلت الصورة هنا"
                                : "اضغط لرفع صورة"}
                            </span>
                            {!isDragActive && " أو اسحب وأفلت"}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG أو GIF (الحد الأقصى 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* زر تغيير الصورة */}
                {imagePreview && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageChange(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                      id="image-change"
                    />
                    <label
                      htmlFor="image-change"
                      className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      تغيير الصورة
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* قسم الصورة الرئيسية */}
            <div>
              <label className="text-sm font-medium text-[#262626] block mb-2">
                صورة موقع الوحدة{" "}
              </label>

              <div className="space-y-3">
                {mainImagePreview && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                      src={mainImagePreview}
                      alt="معاينة الصورة الرئيسية"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        disabled={isLoading}
                        title="حذف الصورة الرئيسية"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-white text-xs font-medium">
                          صورة موقع الوحدة
                        </p>
                        {editedUnit && !isMainImageChanged && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                            صورة موجودة
                          </span>
                        )}
                        {isMainImageChanged && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                            {editedUnit ? "تم التغيير" : "جديدة"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!mainImagePreview && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleMainImageChange(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                      id="main-image-upload"
                    />
                    <div
                      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        isMainImageDragActive
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <label
                        htmlFor="main-image-upload"
                        className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload
                            className={`w-8 h-8 mb-4 ${"text-gray-500"}`}
                          />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              {"اضغط لرفع الصورة الرئيسية"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG أو GIF (الحد الأقصى 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* زر تغيير الصورة الرئيسية */}
                {mainImagePreview && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleMainImageChange(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                      id="main-image-change"
                    />
                    <label
                      htmlFor="main-image-change"
                      className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      تغيير الصورة الرئيسية
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      </FormModal>
    </>
  );
}

export default CreateEditUnit;
