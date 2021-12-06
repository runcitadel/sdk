export abstract class ApiConnection {

  protected _jwt = "";

  public set jwt(jwt: string) {
    this._jwt = jwt;
  }

  protected abstract _request<ResponseType = unknown>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: unknown,
    auth: boolean
  ): Promise<ResponseType> 

  protected async get<ResponseType = unknown>(
    url: string,
    auth = true
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, "GET", undefined, auth);
  }

  protected async post<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, "POST", body, auth);
  }

  protected async put<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, "PUT", body, auth);
  }

  protected async delete<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, "DELETE", body, auth);
  }
}
