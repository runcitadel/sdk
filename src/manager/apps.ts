import { ApiConnection } from "../common/connection.js";
import type { app } from "../common/types";


export class ManagerApps extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/apps`);
  }

  /**
   * List all apps
   * 
   * @param installed Set this to true if you only want a list of installed apps
   * @returns A list of apps with metadata
   */
  async list(installed = false): Promise<app[]> {
    return await this.get(installed ? "/?installed=1" : "/") as app[];
  }

  /**
   * Install an app
   * 
   * @param id The id of the app
   */
  async install(id: string): Promise<void> {
    await this.post(`/${id}/install`);
  }
  /**
   * Unnstall an app
   * 
   * @param id The id of the app
   */
  async uninstall(id: string): Promise<void> {
    await this.post(`/${id}/uninstall`);
  }
}