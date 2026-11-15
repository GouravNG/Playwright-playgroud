import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized: Missing Authorization header" }, { status: 401 });
  }

  return NextResponse.json({
    accountNumber: "ACC-9876543210",
    balance: 14250.75,
    currency: "USD",
    transactions: [
      { id: "TX-901", date: "2024-11-14", desc: "Online Store Payment", amount: -79.99, type: "Debit" },
      { id: "TX-902", date: "2024-11-13", desc: "Salary Deposit", amount: 3500.0, type: "Credit" },
      { id: "TX-903", date: "2024-11-11", desc: "Grocery Supermarket", amount: -145.2, type: "Debit" },
    ],
  });
}
