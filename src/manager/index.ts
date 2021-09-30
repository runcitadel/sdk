import { ApiConnection } from "../common/connection.js";
import { ManagerAuth } from "./auth.js";

export class Manager extends ApiConnection {
    #auth: InstanceType<typeof ManagerAuth>;
    constructor(baseUrl: string) {
        super(baseUrl);
        this.#auth = new ManagerAuth(baseUrl);
    }

    public async isOnline(): Promise<boolean> {
        try {
            await this.get("ping");
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