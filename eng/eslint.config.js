import { defineTypescriptConfig } from "@camaro/eslint-config/typescript";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default defineConfig(
    {
        ignores: ["lib/**", "node_modules/**"],
    },
    defineTypescriptConfig(
        {
            jsx: true,
        },
        {
            files: ["src/server/**/*.ts", "scripts/**/*.ts"],
            languageOptions: {
                globals: globals.node,
            },
        },
        {
            files: ["src/shared/**/*.{ts,tsx}"],
            extends: [
                reactHooks.configs.flat["recommended"],
                reactRefresh.configs.recommended,
            ],
            languageOptions: {
                globals: globals.browser,
            },
        },
        {
            files: ["src/shared/**/*.ts"],
            languageOptions: {
                globals: globals["shared-node-browser"],
            },
        },
        {
            files: ["src/server/**/*.module.ts"],
            rules: { "@typescript-eslint/no-extraneous-class": "off" },
        },
        {
            files: ["src/client/**/*.{ts,tsx}"],
            rules: {
                "@typescript-eslint/no-misused-promises": "off",
                "@typescript-eslint/no-floating-promises": "off",
            },
        },
    ),
);
