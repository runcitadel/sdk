import { ApiConnection } from "../common/connection.js";
import type { versionFile } from "../common/types";

export class ManagerSystem extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/system`);
  }

  /**
   * Get system information
   * 
   * @returns Information about the software on the system
   */
  async info(): Promise<versionFile> {
      return await this.get("info") as versionFile;
  }
}