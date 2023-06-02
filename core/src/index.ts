import { ProjectData } from './types';

export class Project {
  _clientId: string;
  _apiKey: string;

  public endpoint: string;
  public version: string;

  constructor(
    clientId: string,
    apiKey: string,
    version: string = 'v1',
    endpoint: string = 'https://www.youjs.dev/api',
  ) {
    this._clientId = clientId;
    this._apiKey = apiKey;

    this.endpoint = endpoint;
    this.version = version;
  }

  private _getBearerToken() {
    return Buffer.from(`${this._clientId}:${this._apiKey}`).toString('base64');
  }

  async getProject(): Promise<ProjectData> {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${this._getBearerToken()}`);

    return fetch(`${this.endpoint}/${this.version}`, {
      method: 'GET',
      headers: myHeaders,
    }).then((response) => response.json());
  }
}

export * from './types';
