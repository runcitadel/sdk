import { Manager } from "./manager/index.js";
import { Middleware } from "./middleware/index.js";

export default class Citadel {
  #manager;
  #middleware;
  #jwt = "";
  #password = "";

  constructor(baseUrl: string) {
    const middlewareApi = `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}api`;
    const managerApi = `${baseUrl}${
      baseUrl.endsWith("/") ? "" : "/"
    }manager-api`;
    this.#manager = new Manager(managerApi.toString());
    this.#middleware = new Middleware(middlewareApi.toString());
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
    const manager = await this.#manager.isOnline();
    const middleware = await this.#middleware.isOnline();
    let lnd: {
      operational: boolean;
      unlocked: boolean;
    } = {
      operational: false,
      unlocked: false,
    };
    try {
      lnd = await this.#middleware.lnd.info.getStatus();
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
  public async login(password: string, savePw: boolean): Promise<void> {
    this.jwt = await this.#manager.auth.login(password);
    if (savePw) this.#password = password;
  }

  /**
   * Refresh the stored JWT
   */
  public async refresh(): Promise<void> {
    try {
      this.jwt = await this.#manager.auth.refresh();
    } catch {
      if (this.#password)
        this.jwt = await this.#manager.auth.login(this.#password);
      else throw new Error("Can't refresh, lost connection");
    }
  }

  public get jwt(): string {
    return this.#jwt;
  }

  public set jwt(newJwt: string) {
    this.#jwt = newJwt;
    this.#manager.jwt = this.#jwt;
    this.#middleware.jwt = this.#jwt;
  }

  /**
   * Check if a node actually uses Citadel (not Umbrel)
   *
   * @returns {boolean} True if the node is using Citadel
   */
  public async isCitadel(): Promise<boolean> {
    return await this.#manager.isCitadel();
  }

  public get manager(): InstanceType<typeof Manager> {
    return this.#manager;
  }

  public get middleware(): InstanceType<typeof Middleware> {
    return this.#middleware;
  }
}
