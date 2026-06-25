import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

// Define the type for server error responses
interface ServerErrorResponse {
  success: boolean;
  messages: string[];
  message?: string;
  data?: Record<string, unknown>;
}

// Define the type for validation errors
interface ValidationErrorResponse {
  message: string[];
  data: { errors: Record<string, string[]> }; // Field names as keys, and arrays of error messages as values
}

// Type guard to check if the response matches the server error format
function isServerErrorResponse(
  response: unknown
): response is ServerErrorResponse {
  return (
    response &&
    typeof response === "object" &&
    response !== null &&
    typeof (response as ServerErrorResponse).success === "boolean" &&
    Array.isArray((response as ServerErrorResponse).messages)
  );
}

// Type guard to check if the response matches the validation error format
function isValidationErrorResponse(
  response: unknown
): response is ValidationErrorResponse {
  return (
    response &&
    typeof response === "object" &&
    response !== null &&
    Array.isArray((response as ValidationErrorResponse).message) &&
    (response as ValidationErrorResponse).data &&
    typeof (response as ValidationErrorResponse).data.errors === "object"
  );
}

export const handleError = (error: unknown): string[] => {
  if (error instanceof AxiosError) {
    console.log("Error response:", error.response);
    const errorResponse = error.response?.data;

    if (error.response) {
      // Handle new server error format with success: false and messages array
      if (isServerErrorResponse(errorResponse)) {
        const { messages } = errorResponse;

        if (messages && messages.length > 0) {
          messages.forEach((message) => {
            toast.error(message);
          });
          return messages;
        }
      }

      // Handle validation errors (422 status) - old format
      if (isValidationErrorResponse(errorResponse)) {
        const { message } = errorResponse;

        if (message && message.length > 0) {
          message.forEach((msg) => {
            toast.error(msg);
          });
          return message;
        }
      }

      // Handle single message errors
      if (errorResponse?.message) {
        const message = Array.isArray(errorResponse.message)
          ? errorResponse.message[0]
          : errorResponse.message;
        toast.error(message);
        return [message];
      }

      // Handle HTTP status errors
      if (error.response.status === 401) {
        const message = "غير مصرح لك بالوصول";
        toast.error(message);
        return [message];
      } else if (error.response.status === 400) {
        const message = "طلب غير صحيح. يرجى التحقق من البيانات المرسلة";
        toast.error(message);
        return [message];
      } else if (error.response.status === 404) {
        const message = "الصفحة أو البيانات المطلوبة غير موجودة";
        toast.error(message);
        return [message];
      } else if (error.response.status === 500) {
        const message = "خطأ في الخادم. يرجى المحاولة لاحقاً";
        toast.error(message);
        return [message];
      } else {
        const message = `خطأ: ${error.response.status}`;
        toast.error(message);
        return [message];
      }
    }

    // Handle network or unknown Axios errors
    const message = "خطأ في الشبكة. يرجى المحاولة مرة أخرى";
    toast.error(message);
    return [message];
  } else if (error instanceof Error) {
    // Handle non-Axios errors
    console.error(error);
    const message = error.message || "حدث خطأ غير متوقع";
    toast.error(message);
    return [message];
  } else {
    // Handle unexpected errors
    console.error("Unexpected error: ", error);
    const message = "حدث خطأ غير معروف";
    toast.error(message);
    return [message];
  }
};

// Helper function to extract error messages without showing toast
export const getErrorMessages = (error: unknown): string[] => {
  if (error instanceof AxiosError) {
    const errorResponse = error.response?.data;

    if (error.response) {
      // Handle new server error format with success: false and messages array
      if (isServerErrorResponse(errorResponse)) {
        const { messages } = errorResponse;
        if (messages && messages.length > 0) {
          return messages;
        }
      }

      // Handle validation errors - old format
      if (isValidationErrorResponse(errorResponse)) {
        const { message } = errorResponse;
        if (message && message.length > 0) {
          return message;
        }
      }

      // Handle single message errors
      if (errorResponse?.message) {
        const message = Array.isArray(errorResponse.message)
          ? errorResponse.message
          : [errorResponse.message];
        return message;
      }

      return [`خطأ: ${error.response.status}`];
    }

    return ["خطأ في الشبكة"];
  } else if (error instanceof Error) {
    return [error.message || "حدث خطأ غير متوقع"];
  } else {
    return ["حدث خطأ غير معروف"];
  }
};
