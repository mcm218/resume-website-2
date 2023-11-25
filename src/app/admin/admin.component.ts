import { Component } from '@angular/core';
import { ClerkService } from '../services/clerk/clerk.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    clerk;
    constructor(clerk: ClerkService) { 
        clerk.tryLogin();
        this.clerk = clerk;
    }

    tryLogin() {
        this.clerk.tryLogin();
    }
}
