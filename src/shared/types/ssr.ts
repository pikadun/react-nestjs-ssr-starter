export interface RenderAppOptions {
    basename?: string;
    loaderData?: unknown;
    request: Request;
}

export type RenderApp = (options: RenderAppOptions) => Promise<string | null>;
