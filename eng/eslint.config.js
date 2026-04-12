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
            rules: {
                "no-restricted-imports": [
                    "error", {
                        paths: [
                            {
                                name: "@mikro-orm/core",
                                message: "Please import from '@mikro-orm/sqlite' instead.",
                            },
                        ],
                    },
                ],
            },
        },
        {
            files: ["src/server/**/*.module.ts"],
            rules: { "@typescript-eslint/no-extraneous-class": "off" },
        },
        {
            files: ["src/client/**/*.{ts,tsx}"],
            extends: [
                reactHooks.configs.flat["recommended"],
                reactRefresh.configs.recommended,
            ],
            languageOptions: {
                globals: globals.browser,
            },
            rules: {
                "@typescript-eslint/no-misused-promises": "off",
                "@typescript-eslint/no-floating-promises": "off",
            },
        },
        {
            files: ["src/shared/**/*.ts"],
            languageOptions: {
                globals: globals["shared-node-browser"],
            },
        },
    ),
);
