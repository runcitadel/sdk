import { ApiConnection } from "platform/connection.js";

/** A user.json file on Citadel. Some data may automatically be added and not actually in the file */
export type user = {
  /** The user's name */
  name: string;
  /** The list of IDs of installed apps */
  installedApps?: string[];
};

export type changePasswordStatus = {
  percent: number;
  error?: boolean;
};

export class ManagerAuth extends ApiConnection {
  constructor(baseUrl: string) {
    super(`${baseUrl}${baseUrl.endsWith("/") ? "" : "/"}v1/account`);
  }

  /**
   * Login to the node.
   * @param password The users password
   * @returns {string} A JsonWebToken for the user
   */
  public async login(password: string): Promise<string> {
    const data = await this.post("login", {
      password
    });
    if (typeof data !== "object" || data === null)
      throw new Error("Failed to login.");
    if ((data as { jwt: string }).jwt) {
      return (data as { jwt: string }).jwt;
    } else {
      throw new Error("Failed to login.");
    }
  }

  /**
   * Refresh the users login JWT
   *
   * @returns {string} A new JWT for the user
   */
  public async refresh(): Promise<string> {
    const data = await this.post("refresh");
    if (typeof data !== "object" || data === null)
      throw new Error("Failed to login.");
    if ((data as { jwt: string }).jwt) {
      return (data as { jwt: string }).jwt;
    } else {
      throw new Error("Failed to login.");
    }
  }

  /**
   * Retrieve information about the node's main account.
   *
   * @returns {user} The user's data
   */
  public async info(): Promise<user> {
    return (await this.get("info")) as user;
  }

  /**
   * Check if the login worked and the user is still connected
   *
   * @returns {boolean} True if the user is logged in
   */
  public async test(): Promise<boolean> {
    try {
      const data = await this.info();
      if (data && (data as user).name) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  /**
   * Change the users password.
   *
   * @param currentPassword The current password
   * @param newPassword The new password
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.post("change-password", {
      password: currentPassword,
      newPassword
    });
  }

  /**
   * Gets the status of a currently in-progress change password operation.
   *
   * @returns {changePasswordStatus} The status of the password change
   */
  public async changePasswordStatus(): Promise<changePasswordStatus> {
    return (await this.post("change-password/status")) as changePasswordStatus;
  }

  /**
   * Check if the node owner has an account
   *
   * @returns {boolean} True if the user exists
   */
  public async isRegistered(): Promise<boolean> {
    return ((await this.post("registered")) as { registered: boolean })
      .registered;
  }

  /**
   * Register a new user.
   * Currently, this is only possible if no one is registered yet.
   *
   * @param {string} password The users password
   * @param {string} seed The mnemonic seed for the users wallet (LND aezeed)
   * @returns {string} A JsonWebToken for the user
   */
  public async register(password: string, seed: string[]): Promise<string> {
    const data = (await this.post("register", {
      seed,
      password,
      name: "admin"
    })) as { jwt?: string };
    if (!data.jwt) throw new Error("Failed to register new user.");
    return data.jwt;
  }

  /**
   * Retrieve the users mnemonic seed.
   *
   * @returns {string[]} The mnemonic seed
   */
  public async seed(): Promise<string[]> {
    const data = (await this.post("seed")) as { seed?: string[] };
    if (!data.seed) throw new Error("Failed to get seed.");
    return data.seed;
  }
}
