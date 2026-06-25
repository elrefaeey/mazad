import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Eye, EyeOff } from "lucide-react";
import { useState, ReactNode } from "react";
import { cn } from "../../lib/utils";

type InputTypes =
  | "text"
  | "email"
  | "number"
  | "password"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "time"
  | "textarea";

type InputFormProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: InputTypes;
  icon?: ReactNode;
  as?: "input" | "textarea";
  rows?: number;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  description?: string;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
};

export default function InputForm<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  icon,
  as = "input",
  rows = 5,
  disabled = false,
  className,
  required = false,
  min,
  max,
}: InputFormProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const sharedClassNames = cn(
    "bg-[#28524042] text-[#285240A1] border-none placeholder:text-[#285240A1] ",
    "font-din-arabic text-lg rounded-xl",
    "transition-all duration-300 w-full outline-none ring-0",
    "focus:bg-[#28524042] focus:ring-2 focus:ring-[#285240] focus:outline-none",
    "px-3 !py-6",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {label && (
            <FormLabel
              className={cn(
                "text-primary text-base flex items-center gap-2 mb-2 font-medium",
                required && "after:content-['*'] after:ml-0.5 after:text-accent"
              )}
            >
              {icon}
              {label}
            </FormLabel>
          )}
          <div className="relative">
            {as === "textarea" || type === "textarea" ? (
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  rows={rows}
                  disabled={disabled}
                  className={sharedClassNames}
                  dir="rtl"
                />
              </FormControl>
            ) : (
              <FormControl>
                <Input
                  {...field}
                  type={inputType}
                  placeholder={placeholder}
                  disabled={disabled}
                  min={min}
                  max={max}
                  dir="rtl"
                  className={cn(sharedClassNames, "h-10")}
                />
              </FormControl>
            )}

            {isPassword && as === "input" && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition duration-300 z-10"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>

          <FormMessage className="text-red-500 mt-1 text-sm font-medium" />
        </FormItem>
      )}
    />
  );
}
