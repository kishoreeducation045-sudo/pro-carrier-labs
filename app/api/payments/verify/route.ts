import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature, fetchRazorpayPaymentDetails } from "@/lib/razorpay";
import { sendEnrollmentConfirmationEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

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
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !course_id) {
      return NextResponse.json({ error: "Missing payment parameters" }, { status: 400 });
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
      .eq("user_id", user.id)
      .single();

    if (!studentProfile) {
      // Create new student profile
      const newStudentCode = `PCL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const { data: newProfile } = await adminSupabase
        .from("student_profiles")
        .insert({
          user_id: user.id,
          student_id: newStudentCode,
          phone: phone || paymentDetails.contact || user.user_metadata?.phone,
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

    // Fetch user full name & course details
    const { data: userData } = await adminSupabase
      .from("users")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    const studentName = userData?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";
    const studentEmail = user.email || paymentDetails.email || "";

    const { data: course } = await adminSupabase
      .from("courses")
      .select("id, title, price_inr, zoom_link")
      .eq("id", course_id)
      .single();

    const courseTitle = course?.title || "AI Masterclass";
    const amountPaid = paymentDetails.amount || course?.price_inr || 299;

    // 4. Save transaction record with Razorpay UTR ID and full student info
    const { data: transaction, error: txError } = await adminSupabase
      .from("transactions")
      .insert({
        user_id: user.id,
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
          user_id: user.id,
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
    await sendEnrollmentConfirmationEmail({
      to: studentEmail,
      name: studentName,
      courseTitle,
      amount: amountPaid,
      utrId: paymentDetails.utrId,
      studentId: studentProfile?.student_id || "PCL-PENDING",
      zoomLink: course?.zoom_link,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and enrollment confirmed!",
      enrollmentId: enrollment?.id,
      studentId: studentProfile?.student_id,
      utrId: paymentDetails.utrId,
      courseId: course_id,
    });
  } catch (error: any) {
    console.error("Payment verification fatal error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment verification" },
      { status: 500 }
    );
  }
}
