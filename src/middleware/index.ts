import { ApiConnection } from "../common/connection.js";

export class Middleware extends ApiConnection {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    /**
     * Ping a node and get version information
     * 
     * @returns Version information about the node
     */
     public async ping(): Promise<{ version: string, features?: string[], isCitadel?: true | undefined }> {
        return await this.get("ping") as { version: string, features?: string[], isCitadel?: true | undefined }
    }

    public async isOnline(): Promise<boolean> {
        try {
            await this.ping();
            return true;
        } catch {
            return false;
        }
    }
}