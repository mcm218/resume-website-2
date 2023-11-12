import { Component, Input } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { ContactMe } from '../models/contact-me';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  faEnvelope = faEnvelope;
  faLinkedIn = faLinkedin;
  faGithub = faGithub;

  @Input () contact: ContactMe = new ContactMe ();

  constructor() { }


}
