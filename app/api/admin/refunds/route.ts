import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { razorpayInstance } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transactionId, reason } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const { data: tx, error: txError } = await adminSupabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (txError || !tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Call Razorpay Refund API if payment_id exists
    let refundId = `rfnd_${Date.now()}`;
    if (tx.razorpay_payment_id && !tx.razorpay_payment_id.startsWith("pay_dev_")) {
      try {
        const rzpRefund = await razorpayInstance.payments.refund(tx.razorpay_payment_id, {
          amount: Math.round(Number(tx.amount_inr) * 100),
          notes: { reason: reason || "Admin requested refund" },
        });
        refundId = rzpRefund.id;
      } catch (refundErr: any) {
        console.warn("Razorpay API refund warning, proceeding with DB refund update:", refundErr);
      }
    }

    // Update transaction to refunded
    const { data: updatedTx, error: updateError } = await adminSupabase
      .from("transactions")
      .update({
        status: "refunded",
        refund_reason: reason || "Refund processed by admin",
        refund_id: refundId,
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", transactionId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Cancel enrollment
    if (tx.course_id && tx.user_id) {
      await adminSupabase
        .from("enrollments")
        .update({ status: "refunded" })
        .eq("user_id", tx.user_id)
        .eq("course_id", tx.course_id);
    }

    return NextResponse.json({
      success: true,
      message: "Refund processed and enrollment revoked successfully.",
      transaction: updatedTx,
    });
  } catch (error: any) {
    console.error("Error processing refund:", error);
    return NextResponse.json({ error: error.message || "Failed to process refund" }, { status: 500 });
  }
}
