export interface RenderAppOptions {
    basename?: string;
    prefetchedData?: unknown;
    request: Request;
}

export interface RenderAppResult {
    html: string;
    dehydratedState: unknown;
}

export type RenderApp = (options: RenderAppOptions) => Promise<RenderAppResult | null>;
