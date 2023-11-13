import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ResumeService {
    http: HttpClient;

    private apiUrl = environment.apiUrl;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getResume(id: string) {
        // Make call to /api/resumes/:id
        return this.http.get(`${this.apiUrl}/api/resumes/${id}`);
    }
}
