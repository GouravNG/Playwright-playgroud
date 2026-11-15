import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Wireless Headphones", price: 79.99, category: "Electronics", rating: 4.5, inStock: true },
  { id: 2, name: "Running Shoes", price: 59.99, category: "Sports", rating: 4.8, inStock: true },
  { id: 3, name: "Coffee Maker", price: 129.99, category: "Kitchen", rating: 4.2, inStock: false },
  { id: 4, name: "Yoga Mat", price: 34.99, category: "Sports", rating: 4.7, inStock: true },
  { id: 5, name: "Smart Fitness Watch", price: 199.99, category: "Electronics", rating: 4.6, inStock: true },
];

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    source: "live-backend",
    data: products,
  });
}
