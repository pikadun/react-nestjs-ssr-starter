import { SSR_WINDOW_KEY } from "@shared/ssr-data";

import { createApp } from "./ssr";

const baseElement = document.querySelector("base");
const basePath = baseElement?.getAttribute("href") ?? "/";
const ssrData = (window as unknown as Record<string, unknown>)[SSR_WINDOW_KEY];

const { app, router } = createApp({ isBrowser: true, basePath, ssrData });

await router.isReady();

app.mount("#root");
