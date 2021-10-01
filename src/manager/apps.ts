import { ApiConnection } from "../common/connection.js";


export type app = {
  id: string;
  category: string;
  name: string;
  version: string;
  tagline: string;
  description: string;
  developer: string;
  website: string;
  dependencies: string[];
  repo: string;
  support: string;
  port: number;
  gallery: string[];
  path: string;
  defaultPassword: string;
  hiddenService?: string;
  installed?: boolean;
};

export class ManagerApps extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/apps`);
  }

  async list(installed = false): Promise<app[]> {
    return await this.get(installed ? "/?installed=1" : "/") as app[];
  }
}