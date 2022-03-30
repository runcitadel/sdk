import { ApiConnection } from "../common/connection.js";
import { joinUrl } from "../common/utils.js";

type LnAddressSignupResponse =
  | "Address added successfully"
  | "Error: Address limit reached"
  | "Error: Address already in use"
  | "Error: Onion URL already used";
export class ManagerExternal extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v1/external`));
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

  /**
   * Registers a free Lightning address @ln.runcitadel.space and @⚡🏰.ml
   *
   * @param address The address to register (without the @ and the domain)
   */
  async registerAddress(address: string): Promise<LnAddressSignupResponse> {
    return (
      await this.get<{ msg: LnAddressSignupResponse }>(
        `/register-address?address=${address}`
      )
    ).msg;
  }
}
