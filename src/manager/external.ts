import { ApiConnection } from "platform/connection.js";

export class ManagerExternal extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/external`);
  }

  /**
   * Get the current Bitcoin price in another currency
   * @param currency The three-letter code of the currency you want
   *
   * @returns The value as a number
   */
  async price(currency = "USD"): Promise<number> {
    return (
      await this.get<Record<string, number>>(`/price?currency=${currency}`)
    )[currency];
  }
}
