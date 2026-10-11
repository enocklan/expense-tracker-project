
export default [
    {
        ignores: ["dist/**", "node_modules/**"]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                document: "readonly",
                fetch: "readonly",
                FormData: "readonly",
                window: "readonly",
                console: "readonly",
                crypto: "readonly",
                Date: "readonly",
                Intl: "readonly",
                Math: "readonly",
                Number: "readonly",
                String: "readonly",
                Set: "readonly",
                Array: "readonly",
                Object: "readonly",
                Error: "readonly",
                TypeError: "readonly"
            }
        },
        rules: {
            "no-undef": "error",
            "no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" }
            ]
        }
    }
];
