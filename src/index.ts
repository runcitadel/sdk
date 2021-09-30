import { Manager } from "./manager/index.js";
import { Middleware } from "./middleware/index.js";
import fetch from "node-fetch";

export class Citadel {
    #manager;
    #middleware;
    #_jwt = "";
    #password = "";

    constructor(baseUrl: string) {
        const managerApi = new URL("/manager-api", baseUrl);
        const middlewareApi = new URL("/api", baseUrl);
        this.#manager = new Manager(managerApi.toString());
        this.#middleware = new Middleware(middlewareApi.toString());
    }

    /**
     * Check if the node is online, and what parts are online
     */
    public async isOnline(): Promise<{ manager: boolean; middleware: boolean; node: boolean; }> {
     const manager = await this.#manager.isOnline();
     const middleware = await this.#middleware.isOnline();
        return {
            manager,
            middleware,
            node: (manager && middleware),
        };
    }

    /**
     * Login to the node.
     * @param password The users password
     * @param savePw Whether to save the password for later use
     */
    public async login(password: string, savePw: boolean): Promise<void> {
        this.#jwt = await this.#manager.auth.login(password);
        if(savePw)
            this.#password = password;
    }

    /**
     * Refresh the stored JWT
     */
    public async refresh(): Promise<void> {
        try {
            await this.#manager.auth.test();
            this.#jwt = await this.#manager.auth.refresh();
        } catch {
            if(this.#password)
            this.#jwt = await this.#manager.auth.login(this.#password);
            else
                throw new Error("Can't refresh, lost connection")
        }
    }

    set #jwt(newJwt: string) {
        this.#_jwt = newJwt;
        this.#manager.jwt = this.#_jwt;
        this.#middleware.jwt = this.#_jwt;
    }

    /**
     * Try to discover a node on the network
     * @returns The discovered node or false if none found
     */
    public static async discover(): Promise<string | false> {
        const HOSTNAMES = ["umbrel.local", "citadel.local", "umbrel", "citadel"];
        // Try to ping each hostname
        for(const hostname of HOSTNAMES) {
            try {
                await fetch(`http://${hostname}`);
                return hostname;
            } catch {
                continue;
            }
        }
        return false;
    }

    /**
     * Check if a node actually uses Citadel (not Umbrel)
     * 
     * @returns {boolean} True if the node is using Citadel
     */
    public async isCitadel(): Promise<boolean> {
        return await this.#manager.isCitadel();
    }

    public get manager(): InstanceType<typeof Manager> {
        return this.#manager;
    }

    public get middleware(): InstanceType<typeof Middleware> {
        return this.#middleware;
    }
}

export type { Manager } from "./manager/index.js";
export type { Middleware } from "./middleware/index.js";
