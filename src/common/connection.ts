/// <reference lib="dom" />

import {joinUrl} from './utils.js';
import {RequestFunction} from './types.js';

export abstract class ApiConnection {
  protected _jwt = '';

  public set jwt(jwt: string) {
    this._jwt = jwt;
  }

  private readonly _baseUrl: string;
  protected _requestFunc?: RequestFunction;
  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  set requestFunc(requestFunc: RequestFunction) {
    this._requestFunc = requestFunc;
  }

  async _request<ResponseType = unknown>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    url = joinUrl(this._baseUrl, url);
    if (this._requestFunc) {
      return await this._requestFunc<ResponseType>(
        this._jwt,
        url,
        method,
        auth,
      );
    }
    let authHeader = '';
    if (this._jwt) authHeader = `JWT ${this._jwt}`;
    let headers: Record<string, string> = {};
    if (method !== 'GET') {
      headers = {
        'Content-type': 'application/json',
      };
    }
    if (authHeader && auth) {
      headers = {
        ...headers,
        Authorization: authHeader,
      };
    }

    const response = await fetch(url, {
      headers,
      method,
      ...(method !== 'GET' ? {body: JSON.stringify(body)} : {}),
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

    if (typeof parsed === 'string') {
      throw new Error(parsed);
    }

    return parsed as ResponseType;
  }

  protected async get<ResponseType = unknown>(
    url: string,
    auth = true,
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, 'GET', undefined, auth);
  }

  protected async post<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, 'POST', body, auth);
  }

  protected async put<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, 'PUT', body, auth);
  }

  protected async delete<ResponseType = unknown>(
    url: string,
    body: unknown = {},
    auth = true,
  ): Promise<ResponseType> {
    return await this._request<ResponseType>(url, 'DELETE', body, auth);
  }
}
