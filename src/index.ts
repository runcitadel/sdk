import Manager from "./manager/index.js";
import Middleware from "./middleware/index.js";

// Connects to the Citadel api
export default class Citadel {
    public manager;
    public middleware;
    private _jwt = "";
    private _password = "";

    constructor(baseUrl: string) {
        const managerApi = new URL("/manager-api", baseUrl);
        const middlewareApi = new URL("/api", baseUrl);
        this.manager = new Manager(managerApi.toString());
        this.middleware = new Middleware(middlewareApi.toString());
    }

    /**
     * Check if the node is online, and what parts are online
     */
    public async isOnline(): Promise<{ manager: boolean; middleware: boolean; node: boolean; }> {
     const manager = await this.manager.isOnline();
     const middleware = await this.middleware.isOnline();
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
        this.jwt = await this.manager.auth.login(password);
        if(savePw)
            this._password = password;
    }

    /**
     * Refresh the stored JWT
     */
    public async refresh(): Promise<void> {
        try {
            await this.manager.auth.test();
            this.jwt = await this.manager.auth.refresh();
        } catch {
            if(this._password)
            this.jwt = await this.manager.auth.login(this._password);
            else
                throw new Error("Can't refresh, lost connection")
        }
    }

    private set jwt(newJwt: string) {
        this._jwt = newJwt;
        this.manager.jwt = this._jwt;
        this.middleware.jwt = this._jwt;
    }
}