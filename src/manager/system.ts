import { ApiConnection } from "../common/connection.js";
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
    return (await this.get("info")) as versionFile;
  }

  async status(): Promise<systemStatus> {
    return (await this.get("status")) as systemStatus;
  }

  async clearMemoryWarning(): Promise<void> {
    await this.get("clear-memory-warning");
  }

  async getHiddenServiceUrl(): Promise<string> {
    return ((await this.get("dashboard-hidden-service")) as { url: string })
      .url;
  }

  async getElectrumConnectionDetails(): Promise<connectionDetails> {
    return (await this.get("electrum-connection-details")) as connectionDetails;
  }

  async getBitcoinP2PConnectionDetails(): Promise<connectionDetails> {
    return (await this.get(
      "bitcoin-p2p-connection-details"
    )) as connectionDetails;
  }

  async getBitcoinRPConnectionDetails(): Promise<RpcConnectionDetails> {
    return (await this.get(
      "bitcoin-rpc-connection-details"
    )) as RpcConnectionDetails;
  }

  async getLndConnectUrls(): Promise<LndConnectionDetails> {
    return (await this.get("ldconnect-urls")) as LndConnectionDetails;
  }

  async getUpdate(): Promise<false | versionFile> {
    const data = (await this.get("get-update-details")) as {
      update: versionFile | string;
    };
    return typeof data === "string" ? false : (data.update as versionFile);
  }

  async startUpdate(): Promise<void> {
    await this.post("update");
  }

  async backupStatus(): Promise<backupStatus> {
    return (await this.get("backup-status")) as backupStatus;
  }

  async debugResult(): Promise<debugStatus> {
    return (await this.get("debug-result")) as debugStatus;
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
    return (await this.get("storage")) as memUsage;
  }

  async memory(): Promise<memUsage> {
    return (await this.get("memory")) as memUsage;
  }

  async temperature(): Promise<number> {
    return ((await this.get("temperature")) as { temperature: number })
      .temperature;
  }

  async uptime(): Promise<number> {
    return ((await this.get("uptime")) as { uptime: number }).uptime;
  }
}
