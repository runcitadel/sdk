import {ApiConnection} from '../common/connection.js';
import {joinUrl} from '../common/utils.js';
import {
  ChainInfo,
  MempoolInfo,
  MiningInfo,
  NetworkInfo,
  Transaction as LiquidTransaction,
} from './liquid-types';

export type SyncStatus = {
  chain: string;
  percent: number;
  currentBlock: number;
  headerCount: number;
};

export type StatsDump = {
  blockchainInfo: ChainInfo;
  networkInfo: NetworkInfo;
  mempoolInfo: MempoolInfo;
  miningInfo: MiningInfo;
};

export type Stats = {
  difficulty: number;
  size: number;
  mempool: number;
  connections: number;
  networkhashps: number;
};

export type Block = {
  block: string;
  confirmations: number;
  size: number;
  height: number;
  blocktime: number;
  prevblock: string;
  nextblock: string | undefined;
  transactions: string | LiquidTransaction[];
};

export type BasicBlock = {
  hash: string;
  height: number;
  numTransactions: number;
  confirmations: number;
  time: number;
  size: number;
};

export type Transaction = {
  txid: string;
  timestamp: number;
  confirmations: number;
  blockhash: string;
  size: number;
  input: string;
  utxo: unknown;
  rawtx: string;
};

export class MiddlewareLiquid extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v1/liquid/info`));
  }

  async mempool(): Promise<MempoolInfo> {
    return await this.get<MempoolInfo>('/mempool');
  }

  async isInstalled(): Promise<boolean> {
    return (await this.get<{installed: boolean}>('/isInstalled')).installed;
  }

  async blockcount(): Promise<number> {
    return (await this.get<{count: number}>('/blockcount')).count;
  }

  async connections(): Promise<{
    total: number;
    inbound: number;
    outbound: number;
  }> {
    return (
      await this.get<{
        count: {
          total: number;
          inbound: number;
          outbound: number;
        };
      }>('/connections')
    ).count;
  }

  async isOperational(): Promise<boolean> {
    return (await this.get<{operational: boolean}>('/status')).operational;
  }

  async syncStatus(): Promise<SyncStatus> {
    return await this.get<SyncStatus>('/sync');
  }

  async version(): Promise<string> {
    return (await this.get<{version: string}>('/version')).version;
  }

  async statsDump(): Promise<StatsDump> {
    return await this.get<StatsDump>('/statsDump');
  }

  async stats(): Promise<Stats> {
    return await this.get<Stats>('/stats');
  }

  async blockHash(height: number): Promise<string> {
    return (await this.get<{hash: string}>(`/block?height=${height}`)).hash;
  }

  async block(hash: string): Promise<Block> {
    return await this.get<Block>(`/block?hash=${hash}`);
  }

  async blocks(from: number, to: number): Promise<BasicBlock[]> {
    return await this.get<BasicBlock[]>(`/blocks?from=${from}&to=${to}`);
  }
  async getTransaction(txid: string): Promise<Transaction> {
    return await this.get<Transaction>(`/txid/${txid}`);
  }
}
