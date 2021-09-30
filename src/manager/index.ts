import { ApiConnection } from "../common/connection.js";
import { ManagerAuth } from "./auth.js";

export class Manager extends ApiConnection {
    #auth: InstanceType<typeof ManagerAuth>;
    constructor(baseUrl: string) {
        super(baseUrl);
        this.#auth = new ManagerAuth(baseUrl);
    }

    /**
     * Check if a node actually uses Citadel (not Umbrel)
     * 
     * @returns {boolean} True if the node is using Citadel
     */
    public async isCitadel(): Promise<boolean> {
        try {
            const data = await this.ping();
            return data.isCitadel || false;
        } catch {
            return false;
        }
    }

    /**
     * Ping a node and get version information
     * 
     * @returns Version information about the node
     */
    public async ping(): Promise<{ version: string, features?: string[], isCitadel?: true | undefined }> {
        return await this.get("ping") as { version: string, features?: string[], isCitadel?: true | undefined }
    }

    /**
     * Check if the manager is online
     * 
     * @returns {boolean} True if the manager is online
     */
    public async isOnline(): Promise<boolean> {
        try {
            await await this.ping();
            return true;
        } catch {
            return false;
        }
    }

    public get auth(): InstanceType<typeof ManagerAuth> {
        return this.#auth;
    }

    public set jwt(jwt: string) {
        this.#auth.jwt = jwt;
        this._jwt = jwt;
    }
}