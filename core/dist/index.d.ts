export declare class Project {
    _clientId: string;
    _apiKey: string;
    endpoint: string;
    version: string;
    constructor(clientId: string, apiKey: string, version?: string, endpoint?: string);
    private _getBearerToken;
    getProject(): Promise<any>;
}
