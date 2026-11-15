import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      received: body,
      status: "Confirmed",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
