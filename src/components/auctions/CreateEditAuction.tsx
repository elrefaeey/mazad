import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import FormModal from "../../components/ui/FormModal";
import InputForm from "../../components/ui/InputForm";
import { Form } from "../../components/ui/form";
import { Auction, AuctionFormData } from "../../types/auctions";
import { useCreateAuction } from "../../hooks/auctions/useCreateAuction";
import { useUpdateAuction } from "../../hooks/auctions/useUpdateAuction";

const auctionSchema = z
  .object({
    name: z
      .string()
      .min(1, "اسم المزاد مطلوب")
      .min(3, "اسم المزاد يجب أن يكون 3 أحرف على الأقل")
      .max(100, "اسم المزاد يجب أن يكون أقل من 100 حرف"),
    description: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 10, {
        message: "الوصف يجب أن يكون 10 أحرف على الأقل",
      }),
    address: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 5, {
        message: "العنوان يجب أن يكون 5 أحرف على الأقل",
      }),
    startDate: z
      .string()
      .min(1, "تاريخ البداية مطلوب")
      .refine((date) => new Date(date) > new Date(), {
        message: "تاريخ البداية يجب أن يكون في المستقبل",
      }),
    endDate: z.string().min(1, "تاريخ النهاية مطلوب"),
    image: z.any().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية",
    path: ["endDate"],
  });

type Props = {
  editedAuction?: Auction;
  children: React.ReactElement;
  onEdit?: () => void;
};

function CreateEditAuction({ editedAuction, children, onEdit }: Props) {
  const [open, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editedAuction?.image || null
  );
  const [isDragActive] = useState(false);

  const defaultValues: AuctionFormData = {
    name: editedAuction?.name ?? "",
    description: editedAuction?.description ?? "",
    address: editedAuction?.address ?? "",
    startDate: editedAuction?.startDate
      ? new Date(editedAuction.startDate).toISOString().slice(0, 16)
      : "",
    endDate: editedAuction?.endDate
      ? new Date(editedAuction.endDate).toISOString().slice(0, 16)
      : "",
    image: null,
  };
  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionSchema),
    defaultValues,
  });

  const onClose = () => {
    setIsOpen(false);
    form.reset();
    setImagePreview(null);
  };

  const { mutate: createAuction, isPending: isCreating } =
    useCreateAuction(onClose);
  const { mutate: updateAuction, isPending: isUpdating } =
    useUpdateAuction(onClose);

  const onOpen = () => {
    setIsOpen(true);
    form.reset(defaultValues);
    setImagePreview(editedAuction?.image || null);
  };

  const onSubmit = async (data: AuctionFormData) => {
    try {
      const submitData = {
        name: data.name,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        description: data.description,
        address: data.address,
        image: data.image,
      };

      if (editedAuction) {
        updateAuction({
          ...submitData,
          id: editedAuction.id,
        });
        onEdit?.();
      } else {
        createAuction(submitData);
      }
    } catch (error) {
      console.error("Error submitting auction:", error);
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
  };

  const isLoading = isCreating || isUpdating;

  return (
    <>
      {React.cloneElement(children, {
        onClick: onOpen,
      })}

      <FormModal
        describedby="فورم إضافة وتعديل المزادات"
        title={!editedAuction ? "إضافة مزاد جديد" : "تعديل بيانات المزاد"}
        txtBtn={!editedAuction ? "إضافة المزاد" : "تعديل المزاد"}
        submitLoading={isLoading}
        isOpen={open}
        onClose={onClose}
        disabled={isLoading}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <div className="space-y-6">
            <InputForm<AuctionFormData>
              control={form.control}
              name="name"
              placeholder="أدخل اسم المزاد"
              type="text"
              disabled={isLoading}
              required
            />

            <InputForm<AuctionFormData>
              control={form.control}
              name="description"
              placeholder="أدخل وصف المزاد"
              type="textarea"
              disabled={isLoading}
            />

            <InputForm<AuctionFormData>
              control={form.control}
              name="address"
              placeholder="أدخل عنوان المزاد"
              type="text"
              disabled={isLoading}
            />

            <InputForm<AuctionFormData>
              control={form.control}
              name="startDate"
              placeholder="اختر تاريخ ووقت البداية"
              type="datetime-local"
              disabled={isLoading}
              required
            />

            <InputForm<AuctionFormData>
              control={form.control}
              name="endDate"
              placeholder="اختر تاريخ ووقت النهاية"
              type="datetime-local"
              disabled={isLoading}
              required
            />

            {/* قسم صورة المزاد */}
            <div>
              <label className="text-sm font-medium text-[#262626] block mb-2">
                صورة المزاد
              </label>

              <div className="space-y-3">
                {imagePreview && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="معاينة صورة المزاد"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          form.setValue("image", null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        disabled={isLoading}
                        title="حذف الصورة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                      <p className="text-white text-xs font-medium">
                        صورة المزاد
                      </p>
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
                      id="auction-image-upload"
                    />
                    <div
                      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        isDragActive
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <label
                        htmlFor="auction-image-upload"
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
                                : "اضغط لرفع صورة المزاد"}
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
                      id="auction-image-change"
                    />
                    <label
                      htmlFor="auction-image-change"
                      className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700 font-medium"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      تغيير صورة المزاد
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

export default CreateEditAuction;
