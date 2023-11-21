import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.js';

@Injectable({
    providedIn: 'root',
})
export class MixpanelService {
    http: HttpClient;

    //@ts-ignore
    private apiUrl = environment.apiUrl || environment.API_URL;

    constructor(http: HttpClient) {
        this.http = http;
    }

    async track(event: string, data: any) {
        return await this.http.post(`${this.apiUrl}/api/mixpanel/${event}`, data);
    }
}
