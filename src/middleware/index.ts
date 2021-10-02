import { ApiConnection } from "platform/connection.js";
import { MiddlewareBitcoin } from "./bitcoin.js";
import { MiddlewareLND } from "./lnd.js";
import { MiddlewarePages } from "./pages.js";

export class Middleware extends ApiConnection {
  #pages: MiddlewarePages;
  #bitcoin: MiddlewareBitcoin;
  #lnd: MiddlewareLND;
  constructor(baseUrl: string) {
    super(baseUrl);
    this.#pages = new MiddlewarePages(baseUrl);
    this.#bitcoin = new MiddlewareBitcoin(baseUrl);
    this.#lnd = new MiddlewareLND(baseUrl);
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
    return (await this.get("ping")) as {
      version: string;
      features?: string[];
      isCitadel?: true | undefined;
    };
  }

  public async isOnline(): Promise<boolean> {
    try {
      await this.ping();
      return true;
    } catch {
      return false;
    }
  }

  public set jwt(newJwt: string) {
    this.#bitcoin.jwt = newJwt;
    this.#pages.jwt = newJwt;
    this.#lnd.jwt = newJwt;
    this._jwt = newJwt;
  }

  public get pages(): MiddlewarePages {
    return this.#pages;
  }

  public get bitcoin(): MiddlewareBitcoin {
    return this.#bitcoin;
  }

  public get lnd(): MiddlewareLND {
    return this.#lnd;
  }
}
