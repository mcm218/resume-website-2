import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent {

  @Input () title: string = "";
  @Input () skills: Array<any> = new Array <any> ();
  
  constructor() { }
}
