/// <reference types="@rsbuild/core/types" />

import type { RsbuildDevServer } from "@rsbuild/core";
import { type Server } from "http";

declare global {
    var devServer: RsbuildDevServer | undefined;

    interface Application {
        bootstrap: () => Promise<Server>;
        stop: () => Promise<void>;
    }
}
