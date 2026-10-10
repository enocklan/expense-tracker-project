const listeners = new Set();

let state = {
    expenses: [],
    homeCurrency: "KES",
    categoryFilter: "All",
    rates: null,
    ratesUpdatedAt: null,
    rateStatus: "loading",
    rateError: null
};

function publish(nextState) {
    state = nextState;
    listeners.forEach((listener) => listener(state));
}

export function getState() {
    return state;
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function addExpense(expense) {
    publish({
        ...state,
        expenses: [...state.expenses, expense]
    });
}

export function removeExpense(id) {
    publish({
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== id)
    });
}

export function setCategoryFilter(categoryFilter) {
    publish({ ...state, categoryFilter });
}

export function setHomeCurrency(homeCurrency) {
    publish({
        ...state,
        homeCurrency,
        rates: null,
        ratesUpdatedAt: null,
        rateStatus: "loading",
        rateError: null
    });
}

export function setRateLoading() {
    publish({ ...state, rateStatus: "loading", rateError: null });
}

export function setRates(rates, ratesUpdatedAt) {
    publish({
        ...state,
        rates,
        ratesUpdatedAt,
        rateStatus: "ready",
        rateError: null
    });
}

export function setRateError(message) {
    publish({
        ...state,
        rates: null,
        ratesUpdatedAt: null,
        rateStatus: "error",
        rateError: message
    });
}