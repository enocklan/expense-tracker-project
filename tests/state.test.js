
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    getState,
    subscribe,
    addExpense,
    removeExpense,
    setCategoryFilter,
    setHomeCurrency,
    setRateLoading,
    setRates,
    setRateError
} from "../src/state.js";

describe("expense state", () => {
    beforeEach(() => {
        // Reset the module state between tests by reloading it.
        vi.resetModules();
    });

    it("adds an expense and notifies subscribers", async () => {
        const store = await import("../src/state.js");
        const listener = vi.fn();

        const unsubscribe = store.subscribe(listener);

        store.addExpense({
            id: 1,
            description: "Lunch",
            amount: 500,
            currency: "KES",
            category: "Food"
        });

        expect(store.getState().expenses).toHaveLength(1);
        expect(listener).toHaveBeenCalledTimes(1);

        unsubscribe();
    });

    it("removes an expense by ID", () => {
        addExpense({
            id: 2,
            description: "Bus fare",
            amount: 100,
            currency: "KES",
            category: "Transport"
        });

        removeExpense(2);

        expect(getState().expenses).toHaveLength(0);
    });

    it("updates the category filter", () => {
        setCategoryFilter("Food");

        expect(getState().categoryFilter).toBe("Food");
    });

    it("resets rates when the home currency changes", () => {
        setRates({ USD: 1, KES: 129 }, "Today");

        setHomeCurrency("USD");

        expect(getState().homeCurrency).toBe("USD");
        expect(getState().rates).toBeNull();
        expect(getState().rateStatus).toBe("loading");
    });

    it("stores rates and marks them ready", () => {
        setRates({ USD: 1, KES: 129 }, "Today");

        expect(getState().rateStatus).toBe("ready");
        expect(getState().rates.KES).toBe(129);
    });

    it("stores an API error", () => {
        setRateError("Network unavailable");

        expect(getState().rateStatus).toBe("error");
        expect(getState().rateError).toBe("Network unavailable");
    });
});

