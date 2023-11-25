import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ClerkService } from './services/clerk/clerk.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(_clerk: ClerkService) {}
}
