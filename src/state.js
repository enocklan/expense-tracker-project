
const listeners = new Set();

const initialState = {
    expenses: [],
    homeCurrency: "KES",
    categoryFilter: "All",
    rates: null,
    ratesUpdatedAt: null,
    rateStatus: "loading",
    rateError: null
};

let state = { ...initialState };

function publish(nextState) {
    state = nextState;

    listeners.forEach((listener) => {
        listener(state);
    });
}

export function getState() {
    return state;
}

export function subscribe(listener) {
    if (typeof listener !== "function") {
        throw new TypeError("Listener must be a function.");
    }

    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

export function addExpense(expense) {
    const newExpense = { ...expense };

    publish({
        ...state,
        expenses: [...state.expenses, newExpense]
    });

    return newExpense;
}

export function removeExpense(id) {
    const expenseExists = state.expenses.some(
        (expense) => expense.id === id
    );

    if (!expenseExists) {
        return false;
    }

    publish({
        ...state,
        expenses: state.expenses.filter(
            (expense) => expense.id !== id
        )
    });

    return true;
}

export function setCategoryFilter(categoryFilter) {
    publish({
        ...state,
        categoryFilter
    });
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
    publish({
        ...state,
        rateStatus: "loading",
        rateError: null
    });
}

export function setRates(rates, ratesUpdatedAt = null) {
    publish({
        ...state,
        rates: { ...rates },
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

export function resetState() {
    publish({
        ...initialState,
        expenses: [],
        rates: null
    });
}
