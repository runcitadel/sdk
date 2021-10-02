import { ApiConnection } from "platform/connection.js";
import { LNDChannel } from "./lnd/channel.js";

export class MiddlewareLND extends ApiConnection {
  #channel: LNDChannel;
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`);
    this.#channel = new LNDChannel(
      `${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/lnd`
    );
  }

  public set jwt(newJwt: string) {
    this._jwt = newJwt;
    this.#channel.jwt = newJwt;
  }

  public async address(): Promise<string> {
    return (await this.get("address")) as string;
  }

  public async signMessage(message: string): Promise<string> {
    return (await this.post("util/sign-message", { message })) as string;
  }

  public get channel(): LNDChannel {
    return this.#channel;
  }
}
