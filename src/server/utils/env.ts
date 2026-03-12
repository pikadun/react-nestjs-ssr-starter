export const getRequiredEnv = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set.`);
    }

    return value;
};

export enum AppEnv {
    Development = "development",
    Staging = "staging",
    Production = "production",
}

export const getAppEnv = () => {
    let appEnv = getRequiredEnv("APP_ENV");

    if (!Object.values(AppEnv).includes(appEnv as AppEnv)) {
        appEnv = AppEnv.Development;
    }

    return appEnv as AppEnv;
};
