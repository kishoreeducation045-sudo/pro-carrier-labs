import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    const targetEmail = email || "admin@procareerlabs.com";
    const targetRole = role || (targetEmail.includes("admin") ? "super_admin" : "student");

    const response = NextResponse.json({
      success: true,
      user: {
        id: "usr_dev_" + Date.now(),
        email: targetEmail,
        role: targetRole,
        full_name: targetEmail.split("@")[0].toUpperCase(),
      },
    });

    // Set dev auth cookie
    response.cookies.set("pcl_dev_auth", JSON.stringify({
      email: targetEmail,
      role: targetRole,
      id: "usr_dev_1001",
      name: targetEmail.split("@")[0],
    }), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
