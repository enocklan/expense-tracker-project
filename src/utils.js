export function convertAmount(amount, fromCurrency, toCurrency, rates) {
    if (!Number.isFinite(amount) || amount < 0 || !rates || typeof rates !== "object") {
        return null;
    }

    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (
        !Number.isFinite(fromRate)
        || fromRate <= 0
        || !Number.isFinite(toRate)
        || toRate <= 0
    ) {
        return null;
    }

    return amount * (toRate / fromRate);
}

export function calculateTotal(expenses, rates, homeCurrency) {
    return expenses.reduce((total, expense) => {
        if (total === null) {
            return null;
        }

        const converted = convertAmount(
            expense.amount,
            expense.currency,
            homeCurrency,
            rates
        );

        if (converted === null) {
            return null;
        }

        return total + converted;
    }, 0);
}

export function filterExpenses(expenses, category) {
    return category === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === category);
}

export function formatMoney(amount, currency) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        currencyDisplay: "code"
    }).format(amount);
}