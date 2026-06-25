import React, { useState } from "react";
import { handleError, getErrorMessages } from "../utils/errorHandling";

// Component to test error handling
export const ErrorTestComponent: React.FC = () => {
  const [lastError, setLastError] = useState<string[]>([]);

  const testServerError = () => {
    const mockError = {
      response: {
        data: {
          success: false,
          messages: ["national_id already exists", "الرقم القومي موجود بالفعل"],
        },
      },
    };

    const messages = getErrorMessages(mockError);
    setLastError(messages);
    handleError(mockError);
  };

  const testValidationError = () => {
    const mockError = {
      response: {
        data: {
          message: ["الحقل مطلوب", "صيغة غير صحيحة"],
          data: { errors: {} },
        },
      },
    };

    const messages = getErrorMessages(mockError);
    setLastError(messages);
    handleError(mockError);
  };

  const testNetworkError = () => {
    const mockError = new Error("Network connection failed");

    const messages = getErrorMessages(mockError);
    setLastError(messages);
    handleError(mockError);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">اختبار معالجة الأخطاء</h2>

      <div className="space-y-2">
        <button
          onClick={testServerError}
          className="block w-full p-2 bg-red-500 text-white rounded"
        >
          اختبار خطأ السيرفر (الرقم القومي موجود)
        </button>

        <button
          onClick={testValidationError}
          className="block w-full p-2 bg-orange-500 text-white rounded"
        >
          اختبار خطأ التحقق
        </button>

        <button
          onClick={testNetworkError}
          className="block w-full p-2 bg-gray-500 text-white rounded"
        >
          اختبار خطأ الشبكة
        </button>
      </div>

      {lastError.length > 0 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <h3 className="font-semibold">آخر رسائل الخطأ:</h3>
          <ul className="list-disc list-inside">
            {lastError.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
