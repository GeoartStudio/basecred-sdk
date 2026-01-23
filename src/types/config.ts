/**
 * SDK Configuration.
 */

export interface EthosConfig {
  baseUrl: string;        // e.g., "https://api.ethos.network"
  clientId: string;       // Required for X-Ethos-Client header
}

export interface TalentConfig {
  baseUrl: string;        // e.g., "https://api.talentprotocol.com"
  apiKey: string;         // Required for Talent Protocol
}

export interface LevelConfig {
  enabled: boolean;  // default: true
}

export interface SDKConfig {
  ethos: EthosConfig;
  talent: TalentConfig;
  levels?: LevelConfig;  // Optional, defaults to { enabled: true }
}
