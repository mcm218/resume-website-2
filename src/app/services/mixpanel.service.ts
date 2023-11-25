import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import environment from '../../environments/environment.json';

@Injectable({
    providedIn: 'root',
})
export class MixpanelService {
    http: HttpClient;

    private apiUrl = environment.apiUrl;

    constructor(http: HttpClient) {
        this.http = http;
    }

    track(mixpanelEvent: string, data: any) {
        return this.http.post(`${this.apiUrl}/api/mixpanel/${mixpanelEvent.replace(" ", "")}`, data);
    }
}
