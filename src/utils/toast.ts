import toast from "react-hot-toast";

// Custom toast functions with our theme
export const showToast = {
  success: (message: string) => {
    return toast.success(message, {
      style: {
        background: "#F0F9FF",
        border: "1px solid #285240",
        color: "#285240",
        fontFamily: "DIN Next LT Arabic, sans-serif",
        direction: "rtl",
      },
      iconTheme: {
        primary: "#285240",
        secondary: "#F0F9FF",
      },
    });
  },

  error: (message: string) => {
    return toast.error(message, {
      style: {
        background: "#FEF2F2",
        border: "1px solid #DC2626",
        color: "#DC2626",
        fontFamily: "DIN Next LT Arabic, sans-serif",
        direction: "rtl",
      },
      iconTheme: {
        primary: "#DC2626",
        secondary: "#FEF2F2",
      },
    });
  },

  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: "#FFFEF0",
        border: "1px solid #FBCD01",
        color: "#735700",
        fontFamily: "DIN Next LT Arabic, sans-serif",
        direction: "rtl",
      },
      iconTheme: {
        primary: "#FBCD01",
        secondary: "#FFFEF0",
      },
    });
  },

  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, msgs, {
      style: {
        fontFamily: "DIN Next LT Arabic, sans-serif",
        direction: "rtl",
      },
      success: {
        style: {
          background: "#F0F9FF",
          border: "1px solid #285240",
          color: "#285240",
        },
        iconTheme: {
          primary: "#285240",
          secondary: "#F0F9FF",
        },
      },
      error: {
        style: {
          background: "#FEF2F2",
          border: "1px solid #DC2626",
          color: "#DC2626",
        },
        iconTheme: {
          primary: "#DC2626",
          secondary: "#FEF2F2",
        },
      },
      loading: {
        style: {
          background: "#FFFEF0",
          border: "1px solid #FBCD01",
          color: "#735700",
        },
        iconTheme: {
          primary: "#FBCD01",
          secondary: "#FFFEF0",
        },
      },
    });
  },

  custom: (message: string, options?: Record<string, unknown>) => {
    return toast.custom(message, {
      style: {
        fontFamily: "DIN Next LT Arabic, sans-serif",
        direction: "rtl",
      },
      ...options,
    });
  },

  dismiss: (toastId?: string) => {
    return toast.dismiss(toastId);
  },
};
