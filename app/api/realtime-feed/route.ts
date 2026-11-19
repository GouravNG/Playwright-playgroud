import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  let intervalId: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initialPayload = JSON.stringify({
        type: "CONNECTED",
        symbol: "SYSTEM",
        price: 0,
        change: 0,
        volume: 0,
        timestamp: new Date().toISOString(),
        message: "Live Market Stream Connected",
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      const symbols = [
        { sym: "BTC-USD", base: 92450 },
        { sym: "ETH-USD", base: 3420 },
        { sym: "SOL-USD", base: 215 },
        { sym: "NVDA", base: 145 },
        { sym: "AAPL", base: 228 },
      ];

      // Stream periodic price updates
      intervalId = setInterval(() => {
        const item = symbols[Math.floor(Math.random() * symbols.length)];
        const delta = (Math.random() - 0.48) * (item.base * 0.008);
        const price = +(item.base + delta).toFixed(2);
        const change = +(delta).toFixed(2);
        const volume = Math.floor(Math.random() * 50) + 1;

        const data = JSON.stringify({
          type: "TICKER",
          symbol: item.sym,
          price,
          change,
          volume,
          timestamp: new Date().toLocaleTimeString(),
        });

        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          if (intervalId) clearInterval(intervalId);
        }
      }, 1200);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
