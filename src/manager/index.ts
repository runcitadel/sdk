import {ApiConnection} from 'platform/connection.js';
import {RequestFunction} from 'src/common/types.js';
import {ManagerApps} from './apps.js';
import {ManagerAuth} from './auth.js';
import {ManagerExternal} from './external.js';
import {ManagerSystem} from './system.js';

export class Manager extends ApiConnection {
  readonly auth: ManagerAuth;
  readonly apps: ManagerApps;
  readonly external: ManagerExternal;
  readonly system: ManagerSystem;
  constructor(baseUrl: string) {
    super(baseUrl);
    this.auth = new ManagerAuth(baseUrl);
    this.apps = new ManagerApps(baseUrl);
    this.external = new ManagerExternal(baseUrl);
    this.system = new ManagerSystem(baseUrl);
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
    }>('ping');
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

  public set requestFunc(requestFunc: RequestFunction) {
    this.auth.requestFunc =
      this.apps.requestFunc =
      this.external.requestFunc =
      this.system.requestFunc =
      this._requestFunc =
        requestFunc;
  }
}
