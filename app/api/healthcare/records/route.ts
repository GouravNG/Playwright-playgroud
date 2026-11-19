import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const delayParam = searchParams.get("delay");
  const delayMs = delayParam ? parseInt(delayParam, 10) : 3500;

  // Simulate server calculation and latency
  await new Promise((resolve) => setTimeout(resolve, Math.max(500, Math.min(10000, delayMs))));

  const reportId = `HCR-${Math.floor(100000 + Math.random() * 900000)}`;

  return NextResponse.json({
    success: true,
    reportId,
    generatedAt: new Date().toISOString(),
    patient: {
      name: "Eleanor Vance",
      patientId: "PT-88942",
      age: 42,
      bloodType: "A+",
      status: "Stable",
    },
    metrics: {
      restingHeartRate: "68 bpm",
      bloodPressure: "118/76 mmHg",
      glucoseLevel: "94 mg/dL",
      oxygenSaturation: "99%",
      cholesterolTotal: "182 mg/dL",
    },
    diagnosis: "All vitals in optimal range. Cardiovascular markers normal.",
    verifiedBy: "Dr. Alistair Finch, MD (Cardiology)",
    latencyMs: delayMs,
  });
}
