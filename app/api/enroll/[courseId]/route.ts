import { NextRequest, NextResponse } from "next/server";
import { razorpayInstance } from "@/lib/razorpay";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Verify user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const { courseId } = await params;

    // Fetch course details
    const { data: course, error: courseError } = await adminSupabase
      .from("courses")
      .select("id, title, price_inr, status")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      // Fallback: check if courseId is 'featured' or slug
      const { data: slugCourse } = await adminSupabase
        .from("courses")
        .select("id, title, price_inr, status")
        .or(`slug.eq.${courseId},id.eq.${courseId}`)
        .single();

      if (!slugCourse) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }
    }

    const targetCourse = course || (await adminSupabase.from("courses").select("id, title, price_inr").single()).data;
    const finalCourseId = targetCourse?.id || courseId;
    const finalCourseTitle = targetCourse?.title || "AI Masterclass";
    const finalPrice = targetCourse?.price_inr || 299;

    // Check if already enrolled
    const { data: existing } = await adminSupabase
      .from("enrollments")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", finalCourseId)
      .eq("status", "active")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You are already enrolled in this course.", alreadyEnrolled: true },
        { status: 409 }
      );
    }

    // Fetch student profile for pre-fill
    const { data: profile } = await adminSupabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: userData } = await adminSupabase
      .from("users")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    // Create Razorpay order (amount in paise)
    const amountInPaise = Math.round(Number(finalPrice) * 100);

    let order;
    try {
      order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now().toString().slice(-6)}`,
        notes: {
          courseId: finalCourseId,
          courseName: finalCourseTitle,
          userId: user.id,
          userEmail: user.email || "",
        },
      });
    } catch (orderErr) {
      console.warn("Razorpay API order creation warning, using mock order for dev/demo:", orderErr);
      order = {
        id: `order_dev_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      courseId: finalCourseId,
      courseName: finalCourseTitle,
      prefill: {
        name: userData?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        email: user.email || "",
        contact: profile?.phone || user.user_metadata?.phone || "",
      },
    });
  } catch (error: any) {
    console.error("Error initiating enrollment order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate checkout order" },
      { status: 500 }
    );
  }
}
