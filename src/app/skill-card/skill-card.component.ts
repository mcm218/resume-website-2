import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss']
})
export class SkillCardComponent {

  @Input () title: string = '';
  @Input () skill: number = 0;
  
  constructor() { }
}
