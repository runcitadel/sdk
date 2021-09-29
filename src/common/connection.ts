import fetch from "node-fetch";

export default class ApiConnection {
  private baseUrl: string;
  protected _jwt = "";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public set jwt(jwt: string) {
    this._jwt = jwt;
  }

  private async request(
    url: string,
    method: "GET" | "POST" | "PUT" = "GET",
    body: unknown = {}
  ): Promise<unknown> {
    let authHeader = "";
    if (this.jwt) authHeader = `JWT ${this.jwt}`;
    let headers: Record<string, string> = {};
    if (method !== "GET") {
      headers = {
        "Content-type": "application/json"
      };
    }
    if (authHeader)
      headers = {
        ...headers,
        Authorization: authHeader
      };
    /*console.log(
      `${method} ${this.baseUrl}${url.startsWith("/") ? url : "/" + url}...`
    );*/
    const response = await fetch(
      `${this.baseUrl}${url.startsWith("/") ? url : "/" + url}`,
      {
        headers,
        method,
        ...(method !== "GET" ? { body: JSON.stringify(body) } : {})
      }
    );

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    const data = await response.text();
    try {
      return JSON.parse(data);
    } catch {
      throw new Error(`Received invalid data: ${data}`);
    }
  }

  public async get(url: string): Promise<unknown> {
    return await this.request(url);
  }

  public async post(url: string, body: unknown = {}): Promise<unknown> {
    return await this.request(url, "POST", body);
  }

  public async put(url: string, body: unknown = {}): Promise<unknown> {
    return await this.request(url, "PUT", body);
  }
}
