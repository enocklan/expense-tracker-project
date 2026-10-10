import { describe, expect, test } from "vitest";
import { calculateTotal, convertAmount, filterExpenses } from "../src/utils.js";

const expenses = [
    { amount: 100, currency: "USD", category: "Food" },
    { amount: 50, currency: "EUR", category: "Transport" },
    { amount: 0, currency: "USD", category: "Food" }
];

const rates = { USD: 1, EUR: 0.9, KES: 130 };

describe("convertAmount", () => {
    test("converts between currencies using the provided rates", () => {
        expect(convertAmount(10, "USD", "KES", rates)).toBe(1300);
    });

    test("returns null for a missing or invalid rate", () => {
        expect(convertAmount(10, "CAD", "KES", rates)).toBeNull();
        expect(convertAmount(10, "USD", "KES", { USD: 1, KES: 0 })).toBeNull();
    });
});

describe("calculateTotal", () => {
    test("adds expenses converted into the home currency", () => {
        expect(calculateTotal(expenses, rates, "KES")).toBeCloseTo(20222.2222);
    });

    test("returns null when an expense cannot be converted", () => {
        expect(calculateTotal(
            [{ amount: 8, currency: "CAD" }],
            rates,
            "KES"
        )).toBeNull();
    });
});

describe("filterExpenses", () => {
    test("filters by category without modifying the original array", () => {
        const food = filterExpenses(expenses, "Food");

        expect(food).toHaveLength(2);
        expect(food.every((expense) => expense.category === "Food")).toBe(true);
        expect(expenses).toHaveLength(3);
    });

    test("returns all expenses for the All category", () => {
        expect(filterExpenses(expenses, "All")).toBe(expenses);
    });
});