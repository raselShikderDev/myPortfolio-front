import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs/all`, {
      next: { tags: ["blogs"] },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch blogs" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
