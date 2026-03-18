import crypto from "node:crypto";
import { type Socket } from "node:net";

import { createRsbuild, type OnAfterDevCompileFn, type Rspack } from "@rsbuild/core";

import { CLIENT_SOURCE_DIR, SERVER_ENTRY_NAME, SERVER_ENVIRONMENT_NAME } from "./constant.ts";
import rsbuildConfig from "./rsbuild.config.ts";

interface Asset {
    source: () => string | Buffer;
}

const rsbuild = await createRsbuild({ rsbuildConfig });
const devServer = await rsbuild.createDevServer();
const sockets = new Set<Socket>();

let nestApp: Application | undefined;
let legacyHash = "";

const collectChangedFiles = (stats: Rspack.Stats[]) => {
    const files = new Set<string>();

    stats.forEach((stat) => {
        stat.compilation.compiler.modifiedFiles?.forEach(file => files.add(file));
        stat.compilation.compiler.removedFiles?.forEach(file => files.add(file));
    });

    return files;
};

const getServerAssetSource = (stats: Rspack.Stats[]) => {
    const serverStats = stats.find(s => s.compilation.name === SERVER_ENVIRONMENT_NAME);
    const assets = serverStats?.compilation.assets[`${SERVER_ENTRY_NAME}.js`] as Asset | undefined;

    if (!assets) {
        throw new Error("Server assets not found");
    }

    return assets.source().toString();
};

const hasServerFileChanges = (files: Set<string>) => {
    return [...files].some(file => !file.startsWith(CLIENT_SOURCE_DIR));
};

const resetSockets = () => {
    for (const socket of sockets) {
        socket.destroy();
        sockets.delete(socket);
    }
};

const reloadNestApp = async () => {
    await nestApp?.stop();
    nestApp = await devServer.environments[SERVER_ENVIRONMENT_NAME]?.loadBundle(SERVER_ENTRY_NAME);

    if (!nestApp) {
        throw new Error("Nest application failed to load");
    }

    const httpServer = await nestApp.bootstrap();

    httpServer.on("upgrade", (req) => {
        sockets.add(req.socket);
    });

    devServer.connectWebSocket({ server: httpServer });
};

const onAfterDevCompile: OnAfterDevCompileFn = async (info) => {
    const stats = (info.stats as Rspack.MultiStats).stats;
    const files = collectChangedFiles(stats);
    const source = getServerAssetSource(stats);
    const hash = crypto.createHash("md5").update(source).digest("hex");
    const shouldReload = info.isFirstCompile || (legacyHash !== hash && hasServerFileChanges(files));

    if (!shouldReload) {
        return;
    }

    legacyHash = hash;
    resetSockets();
    await reloadNestApp();
};

global.devServer = devServer;
rsbuild.onAfterDevCompile(onAfterDevCompile);
