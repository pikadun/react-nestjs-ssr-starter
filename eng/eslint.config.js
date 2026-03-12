import { defineTypescriptConfig } from "@camaro/eslint-config/typescript";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default defineConfig(
    {
        ignores: ["lib/**", "node_modules/**"],
    },
    defineTypescriptConfig({
        files: ["src/server/**/*.ts", "src/shared/**/*.ts", "scripts/**/*.ts"],
        globals: ["node"],
    }),
    defineConfigWithVueTs({
        files: ["src/client/**/*.ts", "src/client/**/*.vue"],
        languageOptions: {
            globals: globals.browser,
        },
        extends: [
            defineTypescriptConfig(),
            pluginVue.configs["flat/essential"],
            vueTsConfigs.recommended,
        ],
    }),
    {
        files: ["src/server/**/*.module.ts"],
        rules: { "@typescript-eslint/no-extraneous-class": "off" },
    },
);
