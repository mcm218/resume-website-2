import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ResumeService {
    http: HttpClient;

    //@ts-ignore
    private apiUrl = environment.apiUrl || environment.API_URL;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getResume(id: string) {
        // Make call to /api/resumes/:id
        return this.http.get(`${this.apiUrl}/api/resumes/${id}`);
    }
}
