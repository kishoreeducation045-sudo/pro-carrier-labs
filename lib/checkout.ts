"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  courseId: string;
  courseTitle?: string;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
  additionalStudentData?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export async function initiateCourseCheckout(options: CheckoutOptions) {
  const { courseId, onSuccess, onError, onClose, additionalStudentData } = options;

  try {
    // 1. Create order on server
    const res = await fetch(`/api/enroll/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.status === 401) {
      // Not logged in -> redirect to login with return path
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const orderData = await res.json();

    if (!res.ok) {
      if (orderData.alreadyEnrolled) {
        window.location.href = "/my-courses";
        return;
      }
      throw new Error(orderData.error || "Failed to initialize order");
    }

    // 2. Ensure Razorpay script loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
    }

    // 3. Configure Razorpay modal
    const rzpOptions = {
      key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "ProCareerLabs",
      description: orderData.courseName || "AI Masterclass Enrollment",
      image: "https://procareerlabs.com/favicon.ico",
      order_id: orderData.orderId,
      prefill: {
        name: orderData.prefill?.name || "",
        email: orderData.prefill?.email || "",
        contact: additionalStudentData?.phone || orderData.prefill?.contact || "",
      },
      theme: {
        color: "#1e6fff",
        backdrop_color: "rgba(10, 15, 30, 0.9)",
      },
      modal: {
        ondismiss: function () {
          if (onClose) onClose();
        },
      },
      handler: async function (response: any) {
        try {
          // 4. Verify payment on server & save UTR + details to DB
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              course_id: orderData.courseId,
              phone: additionalStudentData?.phone || orderData.prefill?.contact,
              address: additionalStudentData?.address,
              city: additionalStudentData?.city,
              state: additionalStudentData?.state,
              pincode: additionalStudentData?.pincode,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyRes.ok) {
            throw new Error(verifyData.error || "Payment verification failed");
          }

          if (onSuccess) {
            onSuccess(verifyData);
          } else {
            // Redirect to student courses with success state
            window.location.href = `/my-courses?enrolled=success&courseId=${orderData.courseId}&utr=${verifyData.utrId}`;
          }
        } catch (verifyErr: any) {
          if (onError) onError(verifyErr);
          else alert(`Verification failed: ${verifyErr.message}`);
        }
      },
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.on("payment.failed", function (response: any) {
      if (onError) onError(response.error);
      else alert(`Payment Failed: ${response.error?.description || "Transaction cancelled"}`);
    });

    rzp.open();
  } catch (error: any) {
    console.error("Checkout initiation error:", error);
    if (onError) onError(error);
    else alert(`Checkout error: ${error.message}`);
  }
}
