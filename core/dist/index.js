"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
class Project {
    constructor(clientId, apiKey, version = 'v1', endpoint = 'https://youjs.dev/api') {
        this._clientId = clientId;
        this._apiKey = apiKey;
        this.endpoint = endpoint;
        this.version = version;
    }
    _getBearerToken() {
        return Buffer.from(`${this._clientId}:${this._apiKey}`).toString('base64');
    }
    getProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${this._getBearerToken()}`);
            return fetch(`${this.endpoint}/${this.version}`, {
                method: 'GET',
                headers: myHeaders,
            }).then((response) => response.json());
        });
    }
}
exports.Project = Project;
