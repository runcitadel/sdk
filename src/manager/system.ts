import { ApiConnection } from "platform/connection.js";
import type {
  backupStatus,
  connectionDetails,
  debugStatus,
  LndConnectionDetails,
  memUsage,
  RpcConnectionDetails,
  systemStatus,
  versionFile,
} from "../common/types";

export class ManagerSystem extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v2/system`);
  }

  /**
   * Get system information
   *
   * @returns Information about the software on the system
   */
  async info(): Promise<versionFile> {
    return await this.get<versionFile>("info");
  }

  async status(): Promise<systemStatus> {
    return await this.get<systemStatus>("status");
  }

  async clearMemoryWarning(): Promise<void> {
    await this.get("clear-memory-warning");
  }

  async getHiddenServiceUrl(): Promise<string> {
    return (await this.get<{ url: string }>("dashboard-hidden-service")).url;
  }

  async getElectrumConnectionDetails(): Promise<connectionDetails> {
    return await this.get<connectionDetails>("electrum-connection-details");
  }

  async getBitcoinP2PConnectionDetails(): Promise<connectionDetails> {
    return await this.get<connectionDetails>("bitcoin-p2p-connection-details");
  }

  async getBitcoinRPConnectionDetails(): Promise<RpcConnectionDetails> {
    return await this.get<RpcConnectionDetails>(
      "bitcoin-rpc-connection-details"
    );
  }

  async getLndConnectUrls(): Promise<LndConnectionDetails> {
    return await this.get<LndConnectionDetails>("ldconnect-urls");
  }

  async getUpdate(): Promise<false | versionFile> {
    const data = await this.get<{ update: versionFile | string }>(
      "get-update-details"
    );
    return typeof data === "string" ? false : (data.update as versionFile);
  }

  async startUpdate(): Promise<void> {
    await this.post("update");
  }

  async backupStatus(): Promise<backupStatus> {
    return await this.get<backupStatus>("backup-status");
  }

  async debugResult(): Promise<debugStatus> {
    return await this.get<debugStatus>("debug-result");
  }

  async debug(): Promise<void> {
    await this.post("debug");
  }

  async shutdown(): Promise<void> {
    await this.post("shutdown");
  }

  async reboot(): Promise<void> {
    await this.post("reboot");
  }

  async storage(): Promise<memUsage> {
    return await this.get<memUsage>("storage");
  }

  async memory(): Promise<memUsage> {
    return await this.get<memUsage>("memory");
  }

  async temperature(): Promise<number> {
    return (await this.get<{ temperature: number }>("temperature")).temperature;
  }

  async uptime(): Promise<number> {
    return (await this.get<{ uptime: number }>("uptime")).uptime;
  }

  async isCitadelOS(): Promise<boolean> {
    return (
      (await this.get<{ os: "Citadel" | "unknown" }>("/")).os === "Citadel"
    );
  }
}
