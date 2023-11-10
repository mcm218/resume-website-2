import { Component, Input } from '@angular/core';
import { Education } from '../models/education';

@Component({
  selector: 'app-education-card',
  templateUrl: './education-card.component.html',
  styleUrls: ['./education-card.component.scss']
})
export class EducationCardComponent {

  @Input () education: Education = new Education ();

  constructor() { }

}
