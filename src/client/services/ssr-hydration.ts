import type { QueryKey } from "@tanstack/react-query";

interface HydrationEntry {
    queryKey: QueryKey;
}

const registry = new Map<string, HydrationEntry>();

/**
 * 注册页面的 SSR 水合配置。
 * 每个需要 SSR 数据注入的页面调用一次即可。
 */
export function registerSSRHydration(routeId: string, entry: HydrationEntry) {
    registry.set(routeId, entry);
}

export function getSSRHydration(routeId: string): HydrationEntry | undefined {
    return registry.get(routeId);
}
