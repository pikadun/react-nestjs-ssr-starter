/// <reference types="@rsbuild/core/types" />

import type { HydrationState } from "react-router";

declare global {
    interface Window {
        __staticRouterHydrationData?: HydrationState;
    }
}

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module "*.svg?react" {
    import type React from "react";
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}
