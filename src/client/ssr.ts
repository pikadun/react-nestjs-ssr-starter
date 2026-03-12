import Aura from "@primeuix/themes/aura";
import { SSR_DATA_KEY } from "@shared/ssr-data";
import { Config as PrimeVue } from "primevue";
import { createSSRApp } from "vue";

import AppComponent from "./App.vue";
import { createAppRouter, type CreateAppRouterOptions } from "./router";

export interface CreateAppOptions extends CreateAppRouterOptions {
    ssrData?: unknown;
}

export const createApp = (options: CreateAppOptions) => {
    const app = createSSRApp(AppComponent);
    const router = createAppRouter(options);

    app.use(router);
    app.use(PrimeVue, {
        theme: {
            preset: Aura,
        },
    });

    if (options.ssrData !== undefined) {
        app.provide(SSR_DATA_KEY, options.ssrData);
    }

    return { app, router };
};
