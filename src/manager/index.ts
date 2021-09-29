import ApiConnection from "../common/connection.js";
import ManagerAuth from "./auth.js";

export default class Manager extends ApiConnection {
    private _auth: InstanceType<typeof ManagerAuth>;
    constructor(baseUrl: string) {
        super(baseUrl);
        this._auth = new ManagerAuth(baseUrl);
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
        return this._auth;
    }

    public set jwt(jwt: string) {
        this._auth.jwt = jwt;
        this._jwt = jwt;
    }
}