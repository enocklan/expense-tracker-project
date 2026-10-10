
import {
    calculateTotal,
    convertAmount,
    filterExpenses,
    formatMoney
} from "./utils.js";

const appStatus = document.querySelector("#app-status");
const totalElement = document.querySelector("#total-expenses");
const expenseCount = document.querySelector("#expense-count");
const rateUpdated = document.querySelector("#rate-updated");
const expensesList = document.querySelector("#expenses-list");
const homeCurrencySelect = document.querySelector("#home-currency");

const retryButton = document.createElement("button");

retryButton.type = "button";
retryButton.className = "retry-button";
retryButton.textContent = "Retry";
retryButton.hidden = true;
retryButton.id = "retry-rates";

appStatus.after(retryButton);

export function render(state) {
    updateStatus(state);
    homeCurrencySelect.value = state.homeCurrency;

    renderTotal(state);
    renderExpenseCount(state);
    renderRateUpdated(state);
    renderExpenses(state);
}

function updateStatus(state) {
    appStatus.className = `status status-${state.rateStatus}`;

    if (state.rateStatus === "loading") {
        appStatus.textContent =
            `Loading live ${state.homeCurrency} exchange rates…`;
    } else if (state.rateStatus === "error") {
        appStatus.textContent =
            `Exchange rates could not be loaded: ${state.rateError || "Please try again."}`;
    } else {
        appStatus.textContent =
            `Live rates are ready for ${state.homeCurrency}.`;
    }

    retryButton.hidden = state.rateStatus !== "error";
}

function renderTotal(state) {
    if (state.expenses.length === 0) {
        totalElement.textContent = formatMoney(0, state.homeCurrency);
        return;
    }

    if (!state.rates || state.rateStatus !== "ready") {
        totalElement.textContent = state.rateStatus === "loading"
            ? "Loading..."
            : "Conversion unavailable";
        return;
    }

    const total = calculateTotal(
        state.expenses,
        state.rates,
        state.homeCurrency
    );

    totalElement.textContent = total === null
        ? "Conversion unavailable"
        : formatMoney(total, state.homeCurrency);
}

function renderExpenseCount(state) {
    const count = state.expenses.length;

    expenseCount.textContent =
        `${count} ${count === 1 ? "expense" : "expenses"}`;
}

function renderRateUpdated(state) {
    rateUpdated.textContent = state.ratesUpdatedAt
        ? `Rates updated ${state.ratesUpdatedAt}`
        : "Exchange-rate update time unavailable.";
}

function renderExpenses(state) {
    const filteredExpenses = filterExpenses(
        state.expenses,
        state.categoryFilter
    );

    expensesList.replaceChildren();

    if (filteredExpenses.length === 0) {
        const emptyState = document.createElement("p");

        emptyState.className = "empty-state";
        emptyState.textContent = state.expenses.length === 0
            ? "No expenses yet. Add your first expense above."
            : "No expenses match this category.";

        expensesList.append(emptyState);
        return;
    }

    const cards = filteredExpenses.map((expense) =>
        createExpenseCard(expense, state)
    );

    expensesList.append(...cards);
}

function createExpenseCard(expense, state) {
    const card = document.createElement("article");
    const details = document.createElement("div");
    const title = document.createElement("h3");
    const metadata = document.createElement("p");
    const values = document.createElement("div");
    const originalAmount = document.createElement("p");
    const convertedAmount = document.createElement("p");
    const deleteButton = document.createElement("button");

    const converted = state.rates && state.rateStatus === "ready"
        ? convertAmount(
            expense.amount,
            expense.currency,
            state.homeCurrency,
            state.rates
        )
        : null;

    card.className = "expense-card";
    card.dataset.expenseId = String(expense.id);

    details.className = "expense-details";

    title.className = "expense-title";
    title.textContent = expense.description;

    metadata.className = "expense-meta";

    const date = expense.createdAt
        ? new Date(expense.createdAt).toLocaleDateString()
        : "Date unavailable";

    metadata.textContent = `${expense.category} · ${date}`;

    values.className = "expense-values";

    originalAmount.className = "original-amount";
    originalAmount.textContent = formatMoney(
        expense.amount,
        expense.currency
    );

    convertedAmount.className = "converted-amount";

    if (converted !== null) {
        convertedAmount.textContent =
            `≈ ${formatMoney(converted, state.homeCurrency)}`;
    } else if (state.rateStatus === "loading") {
        convertedAmount.textContent = "Loading conversion...";
    } else {
        convertedAmount.textContent = "Conversion unavailable";
    }

    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.deleteId = String(expense.id);
    deleteButton.setAttribute(
        "aria-label",
        `Delete ${expense.description}`
    );
    deleteButton.textContent = "Delete";

    details.append(title, metadata);
    values.append(originalAmount, convertedAmount);
    card.append(details, values, deleteButton);

    return card;
}

export function bindRetryHandler(onRetry) {
    retryButton.addEventListener("click", () => {
        onRetry();
    });
}
