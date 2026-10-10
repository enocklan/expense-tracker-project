
const API_URL = "https://open.er-api.com/v6/latest";

export async function fetchExchangeRates(baseCurrency = "USD") {
    const currency = baseCurrency.trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(currency)) {
        throw new Error("Please provide a valid three-letter currency code.");
    }

    let response;

    try {
        response = await fetch(
            `${API_URL}/${encodeURIComponent(currency)}`
        );
    } catch {
        throw new Error(
            "Unable to connect to the exchange-rate service. Check your internet connection."
        );
    }

    if (!response.ok) {
        throw new Error(
            `Exchange-rate service returned HTTP ${response.status}.`
        );
    }

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            "Exchange-rate service returned invalid JSON."
        );
    }

    if (data.result !== "success") {
        throw new Error(
            data["error-type"] ||
            "Exchange-rate service could not return rates."
        );
    }

    if (
        data.base_code !== currency ||
        !data.rates ||
        typeof data.rates !== "object" ||
        Array.isArray(data.rates) ||
        !Number.isFinite(data.rates[currency]) ||
        data.rates[currency] <= 0
    ) {
        throw new Error(
            "Exchange-rate service returned an invalid rates response."
        );
    }

    return {
        baseCode: data.base_code,
        rates: data.rates,
        updatedAt: data.time_last_update_utc || null
    };
}
