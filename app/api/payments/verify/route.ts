import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature, fetchRazorpayPaymentDetails } from "@/lib/razorpay";
import { sendEnrollmentConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Check optional authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      course_id,
      phone,
      address,
      city,
      state,
      pincode,
      userId,
      email,
      fullName,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !course_id) {
      return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
    }

    // Determine target user ID
    let targetUserId = user?.id || userId;
    if (!targetUserId && email) {
      const { data: u } = await adminSupabase
        .from("users")
        .select("id")
        .eq("email", String(email).trim().toLowerCase())
        .maybeSingle();
      if (u) targetUserId = u.id;
    }

    if (!targetUserId) {
      // Auto-create user record if completely new
      const newId = crypto.randomUUID();
      const studentEmail = email || `${razorpay_payment_id}@guest.procareerlabs.com`;
      await adminSupabase.from("users").insert({
        id: newId,
        email: studentEmail,
        full_name: fullName || "Workshop Attendee",
        role: "student",
      });
      targetUserId = newId;
    }

    // 1. Verify Razorpay cryptographic HMAC signature
    const isValid = verifyRazorpaySignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
    }

    // 2. Fetch payment details & Acquirer UTR ID from Razorpay API
    const paymentDetails = await fetchRazorpayPaymentDetails(razorpay_payment_id);

    // 3. Fetch or update student profile
    let { data: studentProfile } = await adminSupabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (!studentProfile) {
      // Create new student profile
      const newStudentCode = `PCL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const { data: newProfile } = await adminSupabase
        .from("student_profiles")
        .insert({
          user_id: targetUserId,
          student_id: newStudentCode,
          phone: phone || paymentDetails.contact || "",
          address: address || "",
          city: city || "",
          state: state || "",
          pincode: pincode || "",
          profile_complete: true,
        })
        .select()
        .single();
      studentProfile = newProfile;
    } else {
      // Update phone or address if provided
      if (phone || address || city) {
        const { data: updated } = await adminSupabase
          .from("student_profiles")
          .update({
            phone: phone || studentProfile.phone || paymentDetails.contact,
            address: address || studentProfile.address,
            city: city || studentProfile.city,
            state: state || studentProfile.state,
            pincode: pincode || studentProfile.pincode,
            profile_complete: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", studentProfile.id)
          .select()
          .single();
        if (updated) studentProfile = updated;
      }
    }

    // Fetch user full name & workshop details
    const { data: userData } = await adminSupabase
      .from("users")
      .select("full_name, email")
      .eq("id", targetUserId)
      .maybeSingle();

    const studentName = userData?.full_name || fullName || user?.user_metadata?.full_name || "Workshop Attendee";
    const studentEmail = userData?.email || email || paymentDetails.email || "";

    const { data: course } = await adminSupabase
      .from("courses")
      .select("id, title, price_inr, zoom_link, slug")
      .eq("id", course_id)
      .single();

    const courseTitle = course?.title || "AI Masterclass";
    const courseSlug = course?.slug || "ai-masterclass";
    const amountPaid = paymentDetails.amount || course?.price_inr || 299;

    // 4. Save transaction record with Razorpay UTR ID and full student info
    const { data: transaction, error: txError } = await adminSupabase
      .from("transactions")
      .insert({
        user_id: targetUserId,
        course_id: course_id,
        student_profile_id: studentProfile?.id,
        student_id_code: studentProfile?.student_id,
        student_name: studentName,
        student_email: studentEmail,
        student_phone: phone || studentProfile?.phone || paymentDetails.contact || "",
        student_address: address || studentProfile?.address || "",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        razorpay_utr_id: paymentDetails.utrId,
        amount_inr: amountPaid,
        currency: paymentDetails.currency || "INR",
        status: "success",
        payment_method: paymentDetails.method || "card_upi",
      })
      .select()
      .single();

    if (txError) {
      console.error("Error creating transaction record:", txError);
    }

    // 5. Create or activate enrollment record
    const { data: enrollment, error: enrollError } = await adminSupabase
      .from("enrollments")
      .upsert(
        {
          user_id: targetUserId,
          course_id: course_id,
          transaction_id: transaction?.id,
          student_profile_id: studentProfile?.id,
          status: "active",
          progress_percent: 0,
          enrolled_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" }
      )
      .select()
      .single();

    if (enrollError) {
      console.error("Error creating enrollment record:", enrollError);
    }

    // 6. Send confirmation email with student ID & UTR ID
    try {
      if (studentEmail) {
        await sendEnrollmentConfirmationEmail({
          to: studentEmail,
          name: studentName,
          courseTitle,
          amount: amountPaid,
          utrId: paymentDetails.utrId,
          studentId: studentProfile?.student_id || "PCL-PENDING",
          zoomLink: course?.zoom_link,
        });
      }
    } catch (emailErr) {
      console.warn("Could not dispatch confirmation email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment confirmed!",
      enrollmentId: enrollment?.id,
      studentId: studentProfile?.student_id,
      utrId: paymentDetails.utrId,
      courseId: course_id,
      courseSlug,
    });
  } catch (error: unknown) {
    console.error("Payment verification fatal error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process payment verification";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
