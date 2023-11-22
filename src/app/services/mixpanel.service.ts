import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import environment from '../../environments/environment.json';

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

    track(mixpanelEvent: string, data: any) {
        return this.http.post(`${this.apiUrl}/api/mixpanel/${mixpanelEvent.replace(" ", "")}`, data);
    }
}
