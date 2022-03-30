import { Manager } from "./manager/index.js";
import { Middleware } from "./middleware/index.js";
import { joinUrl } from "./common/utils.js";
import { RequestFunction } from "./common/types.js";

export default class Citadel {
  readonly manager;
  readonly middleware;
  private _jwt = "";

  constructor(baseUrl: string) {
    const middlewareApi = joinUrl(baseUrl, "api");
    const managerApi = joinUrl(baseUrl, "manager-api");
    this.manager = new Manager(managerApi.toString());
    this.middleware = new Middleware(middlewareApi.toString());
  }

  /**
   * Check if the node is online, and what parts are online
   */
  public async isOnline(): Promise<{
    manager: boolean;
    middleware: boolean;
    node: boolean;
    lnd: {
      operational: boolean;
      unlocked: boolean;
    };
  }> {
    const manager = await this.manager.isOnline();
    const middleware = await this.middleware.isOnline();
    let lnd: {
      operational: boolean;
      unlocked: boolean;
    } = {
      operational: false,
      unlocked: false,
    };
    try {
      lnd = await this.middleware.lnd.info.getStatus();
    } catch {}

    return {
      manager,
      middleware,
      node: manager && middleware,
      lnd: lnd,
    };
  }

  /**
   * Login to the node.
   * @param password The users password
   * @param savePw Whether to save the password for later use
   */
  public async login(password: string, totpToken: string): Promise<void> {
    this.jwt = await this.manager.auth.login(password, totpToken);
  }

  /**
   * Refresh the stored JWT
   */
  public async refresh(): Promise<void> {
    this.jwt = await this.manager.auth.refresh();
  }

  public get jwt(): string {
    return this._jwt;
  }

  public set jwt(newJwt: string) {
    this._jwt = this.manager.jwt = this.middleware.jwt = newJwt;
  }

  public set requestFunc(requestFunc: RequestFunction) {
    this.manager.requestFunc = this.middleware.requestFunc = requestFunc;
  }

  /**
   * Try to discover a node on the network
   * @returns The discovered node or false if none found
   */
   public static async discover(): Promise<string | false> {
    for (const hostname of ["citadel.local", "citadel"]) {
      try {
        await fetch(`http://${hostname}`);
        return hostname;
      } catch {
        continue;
      }
    }
    return false;
  }
}
