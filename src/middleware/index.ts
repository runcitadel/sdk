import ApiConnection from "../common/connection.js";

export default class Middleware extends ApiConnection {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    public async isOnline(): Promise<boolean> {
        try {
            await this.get("ping");
            return true;
        } catch {
            return false;
        }
    }
}