import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateCertificatePdf } from "@/lib/certificate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Fetch certificate record
    const { data: cert, error: certError } = await adminSupabase
      .from("certificates")
      .select("*, courses(title)")
      .eq("id", id)
      .single();

    if (certError || !cert) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Verify ownership or admin
    const { data: profile } = await adminSupabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = ["admin", "super_admin"].includes(profile?.role);
    if (cert.user_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const issueDate = new Date(cert.issued_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // Generate PDF bytes using pdf-lib
    const pdfBytes = await generateCertificatePdf({
      studentName: cert.student_name,
      courseTitle: cert.course_title || cert.courses?.title || "AI Masterclass",
      certificateCode: cert.certificate_code,
      completionDate: issueDate,
      instructorName: "Neeraj Kumar",
    });

    return new Response(pdfBytes as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ProCareerLabs_Certificate_${cert.certificate_code}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating certificate PDF:", error);
    return NextResponse.json({ error: "Failed to generate certificate PDF" }, { status: 500 });
  }
}
