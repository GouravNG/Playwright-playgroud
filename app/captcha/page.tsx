"use client";
import React, { useState, useEffect, useRef } from "react";
import { WidgetCard } from "@/components/common/WidgetCard";

// Helper to generate dynamic math question
function generateMathQuestion() {
  const num1 = Math.floor(Math.random() * 40) + 10;
  const num2 = Math.floor(Math.random() * 30) + 5;
  const operators = ["+", "-", "*"] as const;
  const operator = operators[Math.floor(Math.random() * operators.length)];
  let expected = 0;
  if (operator === "+") expected = num1 + num2;
  else if (operator === "-") expected = num1 - num2;
  else expected = num1 * num2;
  return { num1, num2, operator, expected, text: `What is ${num1} ${operator} ${num2}?` };
}

// Color/Image Matching categories
interface MatchingItem {
  id: string;
  name: string;
  category: "vehicle" | "animal" | "fruit";
  emoji: string;
}

const ALL_TILES: MatchingItem[] = [
  { id: "car", name: "Car", category: "vehicle", emoji: "🚗" },
  { id: "dog", name: "Dog", category: "animal", emoji: "🐶" },
  { id: "apple", name: "Apple", category: "fruit", emoji: "🍎" },
  { id: "bus", name: "Bus", category: "vehicle", emoji: "🚌" },
  { id: "cat", name: "Cat", category: "animal", emoji: "🐱" },
  { id: "banana", name: "Banana", category: "fruit", emoji: "🍌" },
  { id: "bicycle", name: "Bicycle", category: "vehicle", emoji: "🚲" },
  { id: "fox", name: "Fox", category: "animal", emoji: "🦊" },
  { id: "strawberry", name: "Strawberry", category: "fruit", emoji: "🍓" },
];

export default function CaptchaPage() {
  // --- 1. Dynamic Math Puzzle State ---
  const [mathProblem, setMathProblem] = useState({
    num1: 18,
    num2: 7,
    operator: "+",
    expected: 25,
    text: "What is 18 + 7?",
  });
  const [mathInput, setMathInput] = useState("");
  const [mathStatus, setMathStatus] = useState<"idle" | "success" | "error">("idle");
  const [mathMessage, setMathMessage] = useState("");

  const refreshMath = () => {
    setMathProblem(generateMathQuestion());
    setMathInput("");
    setMathStatus("idle");
    setMathMessage("");
  };

  const handleMathVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(mathInput.trim(), 10);
    if (!isNaN(parsed) && parsed === mathProblem.expected) {
      setMathStatus("success");
      setMathMessage("Verification Successful! Human identity confirmed.");
    } else {
      setMathStatus("error");
      setMathMessage(`Incorrect answer. Expected ${mathProblem.expected}. Please try again!`);
    }
  };

  // --- 2. Horizontal Slider Puzzle State ---
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const [targetOffset] = useState(180); // Target cutout position in px
  const [sliderPosition, setSliderPosition] = useState(0); // 0 to 240px
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [sliderStatus, setSliderStatus] = useState<"idle" | "success" | "error">("idle");
  const [sliderMessage, setSliderMessage] = useState("");

  const handleSliderChange = (newVal: number) => {
    setSliderPosition(newVal);
  };

  const verifySlider = () => {
    // Within tolerance window of +/- 8px
    if (Math.abs(sliderPosition - targetOffset) <= 8) {
      setSliderStatus("success");
      setSliderMessage("Puzzle matched! Slider aligned with cutout.");
    } else {
      setSliderStatus("error");
      setSliderMessage(`Misaligned by ${Math.abs(sliderPosition - targetOffset)}px. Match the target exactly!`);
    }
  };

  const resetSlider = () => {
    setSliderPosition(0);
    setSliderStatus("idle");
    setSliderMessage("");
  };

  // --- 3. Tile / Category Selection Grid State ---
  const [targetCategory, setTargetCategory] = useState<"vehicle" | "animal" | "fruit">("vehicle");
  const [selectedTileIds, setSelectedTileIds] = useState<string[]>([]);
  const [gridStatus, setGridStatus] = useState<"idle" | "success" | "error">("idle");
  const [gridMessage, setGridMessage] = useState("");

  const toggleTile = (id: string) => {
    if (gridStatus === "success") return;
    setSelectedTileIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const verifyGrid = () => {
    const requiredIds = ALL_TILES.filter((t) => t.category === targetCategory).map((t) => t.id);
    const hasAll = requiredIds.every((id) => selectedTileIds.includes(id));
    const hasNoExtras = selectedTileIds.every((id) => requiredIds.includes(id));

    if (hasAll && hasNoExtras) {
      setGridStatus("success");
      setGridMessage(`All ${targetCategory}s correctly selected!`);
    } else {
      setGridStatus("error");
      setGridMessage(`Selection incorrect. Select all ${targetCategory}s and nothing else.`);
    }
  };

  const resetGrid = () => {
    const categories: ("vehicle" | "animal" | "fruit")[] = ["vehicle", "animal", "fruit"];
    const nextCat = categories[(categories.indexOf(targetCategory) + 1) % categories.length];
    setTargetCategory(nextCat);
    setSelectedTileIds([]);
    setGridStatus("idle");
    setGridMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤖</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="page-title">
            Dynamic CAPTCHA & Security Puzzles
          </h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Mastery
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Simulate real-world anti-bot checks and security verification barriers. Practice regex extraction, dynamic arithmetic solving, vector mouse dragging, and multi-element selection grids.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1: Arithmetic & Dynamic Question */}
        <WidgetCard
          title="1. Dynamic Math Arithmetic Challenge"
          testId="widget-math-captcha"
          docUrl="https://playwright.dev/docs/locators#locate-by-text"
          docTitle="Playwright Text & Evaluation"
          hint={`// 1. Extract dynamic arithmetic equation
const questionText = await page.getByTestId('math-question').textContent();
// Matches e.g. "What is 18 + 7?"
const match = questionText.match(/(\\d+)\\s*([+\\-*])\\s*(\\d+)/);
const [_, a, op, b] = match;
const result = op === '+' ? (+a + +b) : op === '-' ? (+a - +b) : (+a * +b);

// 2. Fill solution and verify
await page.getByTestId('math-answer-input').fill(String(result));
await page.getByTestId('btn-verify-math').click();
await expect(page.getByTestId('math-status-msg')).toContainText('Successful');`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Security Challenge
                </span>
                <button
                  type="button"
                  data-testid="btn-refresh-math"
                  onClick={refreshMath}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  🔄 New Problem
                </button>
              </div>
              <p
                data-testid="math-question"
                className="text-lg font-mono font-bold text-gray-900 dark:text-white"
              >
                {mathProblem.text}
              </p>
            </div>

            <form onSubmit={handleMathVerify} className="space-y-3">
              <div>
                <label
                  htmlFor="math-answer"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Enter calculated answer:
                </label>
                <input
                  id="math-answer"
                  data-testid="math-answer-input"
                  type="number"
                  value={mathInput}
                  onChange={(e) => setMathInput(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  data-testid="btn-verify-math"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Verify Math
                </button>
                <button
                  type="button"
                  data-testid="btn-reset-math"
                  onClick={refreshMath}
                  className="px-3 py-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs"
                >
                  Reset
                </button>
              </div>
            </form>

            {mathStatus !== "idle" && (
              <div
                data-testid="math-status-msg"
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  mathStatus === "success"
                    ? "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {mathStatus === "success" ? "✅ " : "❌ "}
                {mathMessage}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Widget 2: Slider Puzzle Piece */}
        <WidgetCard
          title="2. Horizontal Slider Piece Alignment"
          testId="widget-slider-captcha"
          docUrl="https://playwright.dev/docs/input#mouse-move"
          docTitle="Playwright Mouse Vector Actions"
          hint={`// Method A: Using Native Slider Input
await page.getByTestId('slider-range-input').fill('180');
await page.getByTestId('btn-verify-slider').click();
await expect(page.getByTestId('slider-status-msg')).toContainText('matched');

// Method B: Emulating Drag with Mouse
const handle = page.getByTestId('slider-thumb');
const box = await handle.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + 180, box.y + box.height / 2);
await page.mouse.up();`}
        >
          <div className="space-y-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Drag the puzzle piece slider until the moving indicator overlaps the target cutout slot (Target at <strong>{targetOffset}px</strong>).
            </p>

            {/* Visual Canvas Representation */}
            <div
              ref={sliderTrackRef}
              data-testid="slider-track"
              className="relative w-full h-24 bg-gradient-to-r from-slate-200 to-indigo-100 dark:from-slate-800 dark:to-indigo-950/40 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-700"
            >
              {/* Target Cutout Marker */}
              <div
                data-testid="slider-target-cutout"
                style={{ left: `${targetOffset}px` }}
                className="absolute top-2 w-10 h-20 border-2 border-dashed border-amber-500 bg-amber-400/20 rounded flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-300 select-none"
              >
                TARGET
              </div>

              {/* Draggable Moving Piece */}
              <div
                data-testid="slider-moving-piece"
                style={{ left: `${sliderPosition}px` }}
                className="absolute top-2 w-10 h-20 bg-indigo-600/90 text-white shadow-lg rounded flex flex-col items-center justify-center text-xs font-bold transition-none select-none border border-indigo-400"
              >
                <span>🧩</span>
                <span className="text-[9px]">{sliderPosition}px</span>
              </div>
            </div>

            {/* Slider Control */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>0px</span>
                <span data-testid="slider-current-offset" className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                  Offset: {sliderPosition}px
                </span>
                <span>240px</span>
              </div>
              <input
                type="range"
                min="0"
                max="240"
                value={sliderPosition}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                data-testid="slider-range-input"
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                data-testid="btn-verify-slider"
                onClick={verifySlider}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Verify Alignment
              </button>
              <button
                type="button"
                data-testid="btn-reset-slider"
                onClick={resetSlider}
                className="px-3 py-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs"
              >
                Reset
              </button>
            </div>

            {sliderStatus !== "idle" && (
              <div
                data-testid="slider-status-msg"
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  sliderStatus === "success"
                    ? "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {sliderStatus === "success" ? "✅ " : "❌ "}
                {sliderMessage}
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Widget 3: Image / Category Tile Matching Grid */}
        <WidgetCard
          title="3. Category Matching Grid Challenge"
          testId="widget-grid-captcha"
          docUrl="https://playwright.dev/docs/locators#locate-by-role"
          docTitle="Playwright Locator Filtering & Batch Selection"
          hint={`// Select all tiles matching target category (e.g. "vehicle")
const vehicleTiles = page.locator('[data-category="vehicle"]');
const count = await vehicleTiles.count();
for (let i = 0; i < count; i++) {
  await vehicleTiles.nth(i).click();
}

// Click Verify
await page.getByTestId('btn-verify-grid').click();
await expect(page.getByTestId('grid-status-msg')).toContainText('correctly selected');`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Select all images containing a:
              </span>
              <span
                data-testid="grid-target-category"
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white"
              >
                {targetCategory}
              </span>
            </div>

            {/* 3x3 Tile Grid */}
            <div
              data-testid="captcha-tiles-grid"
              className="grid grid-cols-3 gap-2"
            >
              {ALL_TILES.map((tile) => {
                const isSelected = selectedTileIds.includes(tile.id);
                return (
                  <button
                    key={tile.id}
                    type="button"
                    data-testid={`tile-${tile.id}`}
                    data-category={tile.category}
                    data-selected={isSelected}
                    onClick={() => toggleTile(tile.id)}
                    className={`relative p-3 flex flex-col items-center justify-center rounded-lg border text-center transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 ring-2 ring-indigo-500"
                        : "border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <span className="text-2xl mb-1">{tile.emoji}</span>
                    <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                      {tile.name}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                data-testid="btn-verify-grid"
                onClick={verifyGrid}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Verify Selection
              </button>
              <button
                type="button"
                data-testid="btn-reset-grid"
                onClick={resetGrid}
                className="px-3 py-2 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs"
              >
                Change Target
              </button>
            </div>

            {gridStatus !== "idle" && (
              <div
                data-testid="grid-status-msg"
                className={`p-2.5 rounded-lg text-xs font-medium ${
                  gridStatus === "success"
                    ? "bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                    : "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                }`}
              >
                {gridStatus === "success" ? "✅ " : "❌ "}
                {gridMessage}
              </div>
            )}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
