/**
 * SDK Configuration.
 */
export interface EthosConfig {
    baseUrl: string;
    clientId: string;
}
export interface TalentConfig {
    baseUrl: string;
    apiKey: string;
}
export interface LevelConfig {
    enabled: boolean;
}
export interface SDKConfig {
    ethos: EthosConfig;
    talent: TalentConfig;
    levels?: LevelConfig;
}
//# sourceMappingURL=config.d.ts.map