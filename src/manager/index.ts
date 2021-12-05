import { ApiConnection } from "platform/connection.js";
import { ManagerApps } from "./apps.js";
import { ManagerAuth } from "./auth.js";
import { ManagerExternal } from "./external.js";
import { ManagerSystem } from "./system.js";

export class Manager extends ApiConnection {
  readonly auth: InstanceType<typeof ManagerAuth>;
  readonly apps: InstanceType<typeof ManagerApps>;
  readonly external: InstanceType<typeof ManagerExternal>;
  readonly system: InstanceType<typeof ManagerSystem>;
  constructor(baseUrl: string) {
    super(baseUrl);
    this.auth = new ManagerAuth(baseUrl);
    this.apps = new ManagerApps(baseUrl);
    this.external = new ManagerExternal(baseUrl);
    this.system = new ManagerSystem(baseUrl);
  }

  /**
   * Check if a node actually uses Citadel (not Umbrel)
   *
   * @returns {boolean} True if the node is using Citadel
   */
  public async isCitadel(): Promise<boolean> {
    try {
      const data = await this.ping();
      return data.isCitadel || false;
    } catch {
      return false;
    }
  }

  /**
   * Ping a node and get version information
   *
   * @returns Version information about the node
   */
  public async ping(): Promise<{
    version: string;
    features?: string[];
    isCitadel?: true | undefined;
  }> {
    return await this.get<{
      version: string;
      features?: string[];
      isCitadel?: true | undefined;
    }>("ping");
  }

  /**
   * Check if the manager is online
   *
   * @returns {boolean} True if the manager is online
   */
  public async isOnline(): Promise<boolean> {
    try {
      await await this.ping();
      return true;
    } catch {
      return false;
    }
  }

  public set jwt(jwt: string) {
    // This is ugly, but makes the final bundle smaller
    this.auth.jwt =
      this.apps.jwt =
      this.external.jwt =
      this.system.jwt =
      this._jwt =
        jwt;
  }
}
