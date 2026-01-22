/**
 * SDK Configuration — No hardcoded values allowed.
 * Per CLAUDE.md: "Never hardcode URLs, Chain IDs, Contract addresses"
 * Per CLAUDE.md: "Fail fast when config is missing"
 */

export interface EthosConfig {
  baseUrl: string;        // e.g., "https://api.ethos.network"
  clientId: string;       // Required for X-Ethos-Client header
}

export interface TalentConfig {
  baseUrl: string;        // e.g., "https://api.talentprotocol.com"
  apiKey: string;         // Required for Talent Protocol
}

export interface SDKConfig {
  ethos: EthosConfig;
  talent: TalentConfig;
}
