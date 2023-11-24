import { Component } from '@angular/core';
import { ClerkService } from '../services/clerk/clerk.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  constructor(_clerk: ClerkService) {}
}
