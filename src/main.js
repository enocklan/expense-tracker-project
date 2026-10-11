
import { fetchExchangeRates } from "./api.js";
import {
    addExpense,
    getState,
    removeExpense,
    setCategoryFilter,
    setHomeCurrency,
    setRateError,
    setRateLoading,
    setRates,
    subscribe
} from "./state.js";
import { render } from "./ui.js";

const expenseForm = document.querySelector("#expense-form");
const homeCurrencySelect = document.querySelector("#home-currency");
const categoryFilter = document.querySelector("#category-filter");
const expensesList = document.querySelector("#expenses-list");
const retryButton = document.querySelector("#retry-rates");
let latestRequest = 0;

subscribe(render);
render(getState());

async function loadRates() {
    const requestId = ++latestRequest;
    setRateLoading();

    try {
        const { rates, updatedAt } = await fetchExchangeRates(getState().homeCurrency);

        if (requestId === latestRequest) {
            setRates(rates, updatedAt);
        }
    } catch (error) {
        if (requestId === latestRequest) {
            setRateError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    }
}

expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!expenseForm.reportValidity()) {
        return;
    }

    const formData = new FormData(expenseForm);
    const amount = Number(formData.get("amount"));

    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    addExpense({
        id: globalThis.crypto.randomUUID(),
        description: String(formData.get("description")).trim(),
        amount,
        currency: String(formData.get("currency")),
        category: String(formData.get("category")),
        createdAt: new Date().toISOString()
    });
    expenseForm.reset();
    document.querySelector("#description").focus();
});

homeCurrencySelect.addEventListener("change", () => {
    setHomeCurrency(homeCurrencySelect.value);
    loadRates();
});

categoryFilter.addEventListener("change", () => {
    setCategoryFilter(categoryFilter.value);
});

expensesList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-id]");

    if (button) {
        removeExpense(button.dataset.deleteId);
    }
});

retryButton.addEventListener("click", loadRates);

loadRates();