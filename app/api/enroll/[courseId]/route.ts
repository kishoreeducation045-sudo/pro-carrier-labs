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

    // Check optional authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json().catch(() => ({}));
    const { courseId } = await params;

    let effectiveUserId: string;
    let effectiveEmail = "";
    let effectiveName = "";
    let effectivePhone = "";

    if (user) {
      effectiveUserId = user.id;
      effectiveEmail = user.email || "";
      effectiveName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner";
      effectivePhone = body.phone || user.user_metadata?.phone || "";
    } else if (body.email) {
      effectiveEmail = String(body.email).trim().toLowerCase();
      effectiveName = String(body.fullName || body.name || effectiveEmail.split("@")[0]).trim();
      effectivePhone = String(body.phone || "").trim();

      // Find or create student in public.users
      const { data: existingUser } = await adminSupabase
        .from("users")
        .select("id, full_name, email")
        .eq("email", effectiveEmail)
        .maybeSingle();

      if (existingUser) {
        effectiveUserId = existingUser.id;
        effectiveName = existingUser.full_name || effectiveName;
      } else {
        const newId = crypto.randomUUID();
        await adminSupabase.from("users").insert({
          id: newId,
          email: effectiveEmail,
          full_name: effectiveName,
          role: "student",
        });
        effectiveUserId = newId;
      }

      // Ensure student profile exists with PCL ID
      const { data: existingProfile } = await adminSupabase
        .from("student_profiles")
        .select("id, student_id")
        .eq("user_id", effectiveUserId)
        .maybeSingle();

      if (!existingProfile) {
        const studentCode = `PCL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        await adminSupabase.from("student_profiles").insert({
          user_id: effectiveUserId,
          student_id: studentCode,
          phone: effectivePhone,
          city: body.city || "",
          profile_complete: true,
        });
      }
    } else {
      return NextResponse.json(
        { error: "Please provide your Name, Email, and Phone number to enroll." },
        { status: 400 }
      );
    }

    // Fetch workshop details
    const { data: course, error: courseError } = await adminSupabase
      .from("courses")
      .select("id, title, price_inr, status, slug")
      .eq("id", courseId)
      .single();

    let targetCourse = course;
    if (courseError || !course) {
      // Fallback: check if courseId is slug
      const { data: slugCourse } = await adminSupabase
        .from("courses")
        .select("id, title, price_inr, status, slug")
        .or(`slug.eq.${courseId},id.eq.${courseId}`)
        .single();

      targetCourse = slugCourse;
    }

    if (!targetCourse) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
    }

    const finalCourseId = targetCourse.id;
    const finalCourseTitle = targetCourse.title || "AI Masterclass";
    const finalCourseSlug = targetCourse.slug || "ai-masterclass";
    const finalPrice = targetCourse.price_inr || 299;

    // Check if student profile exists for pre-fill
    const { data: profile } = await adminSupabase
      .from("student_profiles")
      .select("phone, student_id")
      .eq("user_id", effectiveUserId)
      .maybeSingle();

    // Create Razorpay order (amount in paise)
    const amountInPaise = Math.round(Number(finalPrice) * 100);

    let order;
    try {
      order = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${effectiveUserId.slice(0, 8)}_${Date.now().toString().slice(-6)}`,
        notes: {
          courseId: finalCourseId,
          courseName: finalCourseTitle,
          courseSlug: finalCourseSlug,
          userId: effectiveUserId,
          userEmail: effectiveEmail,
          userName: effectiveName,
          userPhone: effectivePhone || profile?.phone || "",
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
      courseSlug: finalCourseSlug,
      userId: effectiveUserId,
      studentId: profile?.student_id,
      prefill: {
        name: effectiveName,
        email: effectiveEmail,
        contact: effectivePhone || profile?.phone || "",
      },
    });
  } catch (error: unknown) {
    console.error("Error initiating enrollment order:", error);
    const msg = error instanceof Error ? error.message : "Failed to initiate checkout order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
