import "./patch-source-map.ts";

import crypto from "node:crypto";
import { type Socket } from "node:net";

import { createRsbuild, type OnAfterDevCompileFn, type Rspack } from "@rsbuild/core";

import type { Application } from "../src/shared/types/dev.ts";
import { extendDevServer } from "./dev-server.ts";
import rsbuildConfig from "./rsbuild.config.ts";

const rsbuild = await createRsbuild({ rsbuildConfig });
const devServer = extendDevServer(await rsbuild.createDevServer());
const sockets = new Set<Socket>();

let nestApp: Application | undefined;
let legacyHash = "";

const resetSockets = () => {
    for (const socket of sockets) {
        socket.destroy();
        sockets.delete(socket);
    }
};

const reloadNestApp = async () => {
    await nestApp?.stop();
    nestApp = await devServer.loadServerBundle();

    const httpServer = await nestApp.bootstrap();

    httpServer.on("upgrade", (req) => {
        sockets.add(req.socket);
    });

    devServer.connectWebSocket({ server: httpServer });
};

const onAfterDevCompile: OnAfterDevCompileFn = async (info) => {
    const stats = (info.stats as Rspack.MultiStats).stats;
    const source = devServer.getServerAssetSource(stats);
    const hash = crypto.createHash("md5").update(source).digest("hex");

    if (legacyHash === hash) {
        return;
    }

    legacyHash = hash;
    resetSockets();
    await reloadNestApp();
};

global.__DEV_SERVER__ = devServer;
rsbuild.onAfterDevCompile(onAfterDevCompile);
