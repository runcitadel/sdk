import { joinUrl } from "../../common/utils.js";
import {ApiConnection as BaseClass} from "../../common/connection.js";
export abstract class ApiConnection extends BaseClass {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this._baseUrl = baseUrl;
  }

  protected async _request<ResponseType = unknown>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: unknown = {},
    auth = true
  ): Promise<ResponseType> {
    url = joinUrl(this._baseUrl, url);
    let authHeader = "";
    if (this._jwt) authHeader = `JWT ${this._jwt}`;
    let headers: Record<string, string> = {};
    if (method !== "GET") {
      headers = {
        "Content-type": "application/json",
      };
    }
    if (authHeader && auth)
      headers = {
        ...headers,
        Authorization: authHeader,
      };
    console.log(`[${method}] ${url}`);
    if (method !== "GET") {
      console.log(`body: ${JSON.stringify(body, undefined, 2)}`);
    }

    const response = await fetch(url, {
      headers,
      method,
      ...(method !== "GET" ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const data = await response.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch {
      throw new Error(`Received invalid data: ${data}`);
    }

    if (typeof parsed === "string") {
      throw new Error(parsed);
    }

    return parsed as ResponseType;
  }
}
