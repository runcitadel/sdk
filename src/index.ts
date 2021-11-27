import { request } from "undici";
import BaseCitadel from "./citadel.js";

export class Citadel extends BaseCitadel {
  /**
   * Try to discover a node on the network
   * @returns The discovered node or false if none found
   */
  public static async discover(): Promise<string | false> {
    for (const hostname of ["citadel.local", "citadel"]) {
      try {
        await request(`http://${hostname}`);
        return hostname;
      } catch {
        continue;
      }
    }
    return false;
  }
}

export type { Manager } from "./manager/index";
export type { Middleware } from "./middleware/index";
export type { ManagerApps } from "./manager/apps";
export type { ManagerAuth } from "./manager/auth";
export type { ManagerExternal } from "./manager/external";
export type { ManagerSystem } from "./manager/system";
export type { MiddlewarePages } from "./middleware/pages";
export type { MiddlewareLND } from "./middleware/lnd";
export type { MiddlewareBitcoin } from "./middleware/bitcoin";
export type { LNDChannel } from "./middleware/lnd/channel";
export type { LNDInfo } from "./middleware/lnd/info";
export type { LNDLightning } from "./middleware/lnd/lightning";
export type { LNDWallet } from "./middleware/lnd/wallet";
