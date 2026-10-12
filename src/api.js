
const API_URL = "https://open.er-api.com/v6/latest";

export async function fetchExchangeRates(baseCurrency = "USD") {
    try {
        const response = await fetch(`${API_URL}/${baseCurrency}`);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates.");
        }

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Could not load exchange rates.");
        }

        return {
            rates: data.rates,
            updatedAt: data.time_last_update_utc || null
        };
    } catch (error) {
        throw new Error(error.message || "Network error. Check your connection.");
    }
}
