/**
 * Patch for vm.SourceTextModule source map support.
 *
 * Node.js's `vm.SourceTextModule` does not call `maybeCacheSourceMap` internally,
 * so `--enable-source-maps` has no effect on modules loaded via SourceTextModule.
 *
 * This patch wraps the SourceTextModule constructor to extract inline source maps
 * from the source code and register them into Node.js's source map cache using
 * `new Function()` (which does trigger the internal caching mechanism).
 */
import vm from "node:vm";

const OriginalSourceTextModule = vm.SourceTextModule;

const SOURCEMAP_RE = /\/\/[#@]\s*sourceMappingURL\s*=\s*(\S+)\s*$/m;

vm.SourceTextModule = class PatchedSourceTextModule extends OriginalSourceTextModule {
    constructor(source: string, options?: vm.SourceTextModuleOptions) {
        super(source, options);

        const identifier = options?.identifier;

        if (identifier) {
            const match = SOURCEMAP_RE.exec(source);
            if (match) {
                try {
                    // Executing a no-op Function with sourceURL + sourceMappingURL
                    // triggers Node.js internal source map cache registration.

                    // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
                    new Function(
                        `//# sourceURL=${identifier}\n//# sourceMappingURL=${match[1]}`,
                    )();
                }
                catch {
                    // Silently ignore — source map registration is best-effort.
                }
            }
        }
    }
};
