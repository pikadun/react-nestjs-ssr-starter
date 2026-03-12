import type { InjectionKey } from "vue";

export const SSR_DATA_KEY: InjectionKey<unknown> = Symbol("ssr-data");

export const SSR_WINDOW_KEY = "__SSR_DATA__";
