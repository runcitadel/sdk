import {ApiConnection} from '../common/connection.js';
import {joinUrl} from '../common/utils.js';

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
    super(joinUrl(baseUrl, `v1/account`));
  }

  /**
   * Login to the node.
   * @param password The users password
   * @param totpToken The TOTP token
   * @returns {string} A JsonWebToken for the user
   */
  public async login(password: string, totpToken: string): Promise<string> {
    const data = await this.post<{jwt?: string}>(
      'login',
      {
        password,
        totpToken,
      },
      false,
    );
    if (typeof data !== 'object' || data === null || !data.jwt) {
      throw new Error('Failed to login.');
    }
    return data.jwt;
  }

  /**
   * Refresh the users login JWT
   *
   * @returns {string} A new JWT for the user
   */
  public async refresh(): Promise<string> {
    const data = await this.post<{jwt: string}>('refresh');
    if (typeof data !== 'object' || data === null || !data.jwt) {
      throw new Error('Failed to login.');
    }
    return data.jwt;
  }

  /**
   * Retrieve information about the node's main account.
   *
   * @returns {user} The user's data
   */
  public async info(): Promise<user> {
    return await this.get<user>('info');
  }

  /**
   * Check if the login worked and the user is still connected
   *
   * @returns {boolean} True if the user is logged in
   */
  public async test(): Promise<boolean> {
    try {
      const data = await this.info();
      if (data && data.name) {
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
   * @param totpToken The TOTP token
   */
  public async changePassword(
    currentPassword: string,
    newPassword: string,
    totpToken: string,
  ): Promise<void> {
    await this.post(
      'change-password',
      {
        password: currentPassword,
        newPassword,
        totpToken,
      },
      false,
    );
  }

  /**
   * Gets the status of a currently in-progress change password operation.
   *
   * @returns {changePasswordStatus} The status of the password change
   */
  public async changePasswordStatus(): Promise<changePasswordStatus> {
    return await this.post<changePasswordStatus>('change-password/status');
  }

  /**
   * Check if the node owner has an account
   *
   * @returns {boolean} True if the user exists
   */
  public async isRegistered(): Promise<boolean> {
    return (await this.get<{registered: boolean}>('registered')).registered;
  }

  /**
   * Register a new user.
   * Currently, this is only possible if no one is registered yet.
   *
   * @param {string} username The users name
   * @param {string} password The users password
   * @param {string} seed The mnemonic seed for the users wallet (LND aezeed)
   * @returns {string} A JsonWebToken for the user
   */
  public async register(
    username: string,
    password: string,
    seed: string[],
  ): Promise<{jwt: string, backupId?: string}> {
    const data = await this.post<{jwt?: string, backupId?: string}>('register', {
      seed,
      password,
      name: username,
    });
    if (!data.jwt) throw new Error('Failed to register new user.');
    return data as {jwt: string, backupId?: string};
  }

  /**
   * Retrieve the users mnemonic seed.
   *
   * @param password The users password as plain text
   * @returns {string[]} The mnemonic seed
   */
  public async seed(password: string, totpToken?: string): Promise<string[]> {
    const data = await this.post<{seed?: string[]}>(
      'seed',
      {
        password,
        totpToken,
      },
      false,
    );
    if (!data.seed) throw new Error('Failed to get seed.');
    return data.seed;
  }

  /**
   * Sets up TOTP for the user.
   *
   * @returns {string} The TOTP key
   */
  public async setupTotp(): Promise<string> {
    return (await this.get<{key: string}>('totp/setup')).key;
  }

  /**
   * Actually enables TOTP by checking if a correct code is given.
   * @param key The TOTP key
   */
  public async enableTotp(key: string): Promise<void> {
    await this.post('totp/enable', {
      authenticatorToken: key,
    });
  }

  public async disableTotp(key: string): Promise<void> {
    await this.post('totp/disable', {
      authenticatorToken: key,
    });
  }

  public async isTotpEnabled(): Promise<boolean> {
    return (await this.get<{totpEnabled: boolean}>('totp/status')).totpEnabled;
  }
}
