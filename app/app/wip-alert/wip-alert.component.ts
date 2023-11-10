import { Component, ElementRef, ViewChild } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wip-alert',
  templateUrl: './wip-alert.component.html',
  styleUrls: ['./wip-alert.component.scss']
})
export class WipAlertComponent {
  faXmark = faXmark;

  @ViewChild ('wip_alert') wipAlertElement!: ElementRef;

  constructor() { }

  close () : void {
    this.wipAlertElement.nativeElement.style.display = "none";
  }
}
