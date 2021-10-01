import { ApiConnection } from "platform/connection.js";
import { ManagerApps } from "./apps.js";
import { ManagerAuth } from "./auth.js";
import { ManagerExternal } from "./external.js";
import { ManagerSystem } from "./system.js";

export class Manager extends ApiConnection {
    #auth: InstanceType<typeof ManagerAuth>;
    #apps: InstanceType<typeof ManagerApps>;
    #external: InstanceType<typeof ManagerExternal>;
    #system: InstanceType<typeof ManagerSystem>;
    constructor(baseUrl: string) {
        super(baseUrl);
        this.#auth = new ManagerAuth(baseUrl);
        this.#apps = new ManagerApps(baseUrl);
        this.#external = new ManagerExternal(baseUrl);
        this.#system = new ManagerSystem(baseUrl);
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

    public get apps(): InstanceType<typeof ManagerApps> {
        return this.#apps;
    }

    public get external(): InstanceType<typeof ManagerExternal> {
        return this.#external;
    }

    public get system(): InstanceType<typeof ManagerSystem> {
        return this.#system;
    }

    public set jwt(jwt: string) {
        this.#auth.jwt = jwt;
        this._jwt = jwt;
    }
}