export abstract class ApiConnection {
  #baseUrl: string;
  protected _jwt = "";

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl;
  }

  public set jwt(jwt: string) {
    this._jwt = jwt;
  }

  async #request(
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
    const response = await fetch(
      `${this.#baseUrl}${url.startsWith("/") ? url : "/" + url}`,
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

  protected async get(url: string): Promise<unknown> {
    return await this.#request(url);
  }

  protected async post(url: string, body: unknown = {}): Promise<unknown> {
    return await this.#request(url, "POST", body);
  }

  protected async put(url: string, body: unknown = {}): Promise<unknown> {
    return await this.#request(url, "PUT", body);
  }
}
