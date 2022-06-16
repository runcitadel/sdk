import {ApiConnection} from '../common/connection.js';
import {RequestFunction} from 'src/common/types.js';
import {MiddlewareBitcoin} from './bitcoin.js';
import {MiddlewareLND} from './lnd.js';
import {MiddlewareLiquid} from './liquid';
import {MiddlewarePages} from './pages.js';

export class Middleware extends ApiConnection {
  readonly pages: MiddlewarePages;
  readonly bitcoin: MiddlewareBitcoin;
  readonly lightning: MiddlewareLND;
  readonly liquid: MiddlewareLiquid;
  constructor(baseUrl: string) {
    super(baseUrl);
    this.pages = new MiddlewarePages(baseUrl);
    this.bitcoin = new MiddlewareBitcoin(baseUrl);
    this.lightning = new MiddlewareLND(baseUrl);
    this.liquid = new MiddlewareLiquid(baseUrl);
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

  public async isOnline(): Promise<boolean> {
    try {
      await this.ping();
      return true;
    } catch {
      return false;
    }
  }

  public set jwt(newJwt: string) {
    this.bitcoin.jwt =
      this.pages.jwt =
      this.lightning.jwt =
      this.liquid.jwt =
      this._jwt =
        newJwt;
  }

  public set requestFunc(requestFunc: RequestFunction) {
    this.bitcoin.requestFunc =
      this.pages.requestFunc =
      this.lightning.requestFunc =
      this.liquid.requestFunc =
      this._requestFunc =
        requestFunc;
  }

  public set onAuthFailed(callback: (url: string) => void) {
    this.bitcoin.onAuthFailed =
      this.pages.onAuthFailed =
      this.lightning.onAuthFailed =
      this.liquid.onAuthFailed =
      this._onAuthFailed =
        callback;
  }
}
