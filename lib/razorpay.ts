import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder",
});

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: VerifyPaymentParams): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder";
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
}

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  email?: string;
  contact?: string;
  utrId: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
}

export async function fetchRazorpayPaymentDetails(paymentId: string): Promise<PaymentDetails> {
  try {
    const payment = (await razorpayInstance.payments.fetch(paymentId)) as any;

    // Extract UTR / Bank reference / Acquirer transaction ID
    const utrId =
      payment.acquirer_data?.utr ||
      payment.acquirer_data?.bank_transaction_id ||
      payment.acquirer_data?.rrn ||
      payment.acquirer_data?.auth_code ||
      payment.id;

    return {
      id: payment.id,
      amount: (payment.amount || 0) / 100,
      currency: payment.currency || "INR",
      status: payment.status || "captured",
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      utrId: String(utrId),
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
    };
  } catch (error) {
    console.error("Error fetching payment from Razorpay:", error);
    return {
      id: paymentId,
      amount: 0,
      currency: "INR",
      status: "unknown",
      utrId: `UTR-${Date.now()}-${paymentId.slice(-6)}`,
    };
  }
}
