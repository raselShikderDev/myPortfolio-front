import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Read httpOnly cookie from request
    const cookie = req.cookies.get("accessToken")?.value;

    if (!cookie) {
      return NextResponse.json({ success: false, message: "No token found" }, { status: 401 });
    }

    // Call backend API with Bearer token
    const res = await fetch("http://localhost:5000/api/v1/blogs/stats", {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ success: false, message: "Backend error", error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: String(err) }, { status: 500 });
  }
}
