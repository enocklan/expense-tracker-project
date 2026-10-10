
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
    setRateError,
    resetState
} from "../src/state.js";

describe("expense state", () => {
    beforeEach(() => {
        resetState();
    });

    it("starts with the initial state", () => {
        expect(getState().expenses).toEqual([]);
        expect(getState().homeCurrency).toBe("KES");
        expect(getState().categoryFilter).toBe("All");
        expect(getState().rateStatus).toBe("loading");
    });

    it("adds an expense", () => {
        addExpense({
            id: 1,
            description: "Lunch",
            amount: 500,
            currency: "KES",
            category: "Food"
        });

        expect(getState().expenses).toHaveLength(1);
        expect(getState().expenses[0].description).toBe("Lunch");
    });

    it("removes an existing expense", () => {
        addExpense({
            id: 1,
            description: "Lunch",
            amount: 500,
            currency: "KES",
            category: "Food"
        });

        expect(removeExpense(1)).toBe(true);
        expect(getState().expenses).toHaveLength(0);
    });

    it("returns false when the expense does not exist", () => {
        expect(removeExpense(999)).toBe(false);
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

        expect(getState().rates).toEqual({ USD: 1, KES: 129 });
        expect(getState().ratesUpdatedAt).toBe("Today");
        expect(getState().rateStatus).toBe("ready");
        expect(getState().rateError).toBeNull();
    });

    it("stores an error when rates fail to load", () => {
        setRateError("Network unavailable");

        expect(getState().rateStatus).toBe("error");
        expect(getState().rateError).toBe("Network unavailable");
        expect(getState().rates).toBeNull();
    });

    it("sets the loading status", () => {
        setRateError("Network unavailable");

        setRateLoading();

        expect(getState().rateStatus).toBe("loading");
        expect(getState().rateError).toBeNull();
    });

    it("notifies subscribers when state changes", () => {
        const listener = vi.fn();
        const unsubscribe = subscribe(listener);

        addExpense({
            id: 2,
            description: "Bus fare",
            amount: 100,
            currency: "KES",
            category: "Transport"
        });

        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(getState());

        unsubscribe();
    });

    it("stops notifying a listener after unsubscribe", () => {
        const listener = vi.fn();
        const unsubscribe = subscribe(listener);

        unsubscribe();

        addExpense({
            id: 3,
            description: "Book",
            amount: 300,
            currency: "KES",
            category: "Shopping"
        });

        expect(listener).not.toHaveBeenCalled();
    });
});
