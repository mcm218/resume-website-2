import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ResumeService {
    http: HttpClient;
    constructor(http: HttpClient) {
        this.http = http;
    }

    getResume(id: string) {
        // Make call to /api/resumes/:id
        return this.http.get(`http://localhost:3000/api/resumes/${id}`);
    }
}
