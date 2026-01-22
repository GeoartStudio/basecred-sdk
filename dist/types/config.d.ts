/**
 * SDK Configuration — No hardcoded values allowed.
 * Per CLAUDE.md: "Never hardcode URLs, Chain IDs, Contract addresses"
 * Per CLAUDE.md: "Fail fast when config is missing"
 */
export interface EthosConfig {
    baseUrl: string;
    clientId: string;
}
export interface TalentConfig {
    baseUrl: string;
    apiKey: string;
}
export interface SDKConfig {
    ethos: EthosConfig;
    talent: TalentConfig;
}
//# sourceMappingURL=config.d.ts.map