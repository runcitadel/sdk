import { ApiConnection } from "platform/connection.js";
import {
  ChainInfo,
  MempoolInfo,
  MiningInfo,
  NetworkInfo,
  Transaction,
} from "./bitcoin-types";

export class MiddlewareBitcoin extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v2/bitcoin/info`);
  }

  async mempool(): Promise<MempoolInfo> {
    return (await this.get("/mempool")) as MempoolInfo;
  }

  async blockcount(): Promise<number> {
    return ((await this.get("/blockcount")) as { count: number }).count;
  }

  async connections(): Promise<number> {
    return ((await this.get("/connections")) as { count: number }).count;
  }

  async isOperational(): Promise<boolean> {
    return ((await this.get("/status")) as { operational: boolean })
      .operational;
  }

  async syncStatus(): Promise<{
    chain: string;
    percent: number;
    currentBlock: number;
    headerCount: number;
  }> {
    return (await this.get("/sync")) as {
      chain: string;
      percent: number;
      currentBlock: number;
      headerCount: number;
    };
  }

  async version(): Promise<string> {
    return ((await this.get("/version")) as { version: string }).version;
  }

  async statsDump(): Promise<{
    blockchain_info: ChainInfo;
    network_info: NetworkInfo;
    mempool: MempoolInfo;
    mining_info: MiningInfo;
  }> {
    return (await this.get("/statsDump")) as {
      blockchain_info: ChainInfo;
      network_info: NetworkInfo;
      mempool: MempoolInfo;
      mining_info: MiningInfo;
    };
  }

  async stats(): Promise<{
    difficulty: number;
    size: number;
    mempool: number;
    connections: number;
    networkhashps: number;
  }> {
    return (await this.get("/stats")) as {
      difficulty: number;
      size: number;
      mempool: number;
      connections: number;
      networkhashps: number;
    };
  }

  async blockHash(height: number): Promise<string> {
    return ((await this.get(`/block?height=${height}`)) as { hash: string })
      .hash;
  }

  async block(hash: string): Promise<{
    block: string;
    confirmations: number;
    size: number;
    height: number;
    blocktime: number;
    prevblock: string;
    nextblock: string | undefined;
    transactions: string | Transaction[];
  }> {
    return (await this.get(`/block?hash=${hash}`)) as {
      block: string;
      confirmations: number;
      size: number;
      height: number;
      blocktime: number;
      prevblock: string;
      nextblock: string | undefined;
      transactions: string | Transaction[];
    };
  }

  async blocks(
    from: number,
    to: number
  ): Promise<
    {
      hash: string;
      height: number;
      numTransactions: number;
      confirmations: number;
      time: number;
      size: number;
    }[]
  > {
    return (await this.get(`/blocks?from=${from}&to=${to}`)) as {
      hash: string;
      height: number;
      numTransactions: number;
      confirmations: number;
      time: number;
      size: number;
    }[];
  }
  async getTransaction(txid: string): Promise<{
    txid: string;
    timestamp: number;
    confirmations: number;
    blockhash: string;
    size: number;
    input: string;
    utxo: unknown;
    rawtx: string;
  }> {
    return (await this.get(`/txid/${txid}`)) as {
      txid: string;
      timestamp: number;
      confirmations: number;
      blockhash: string;
      size: number;
      input: string;
      utxo: unknown;
      rawtx: string;
    };
  }

  public set jwt(newJwt: string) {
    this._jwt = newJwt;
  }
}
