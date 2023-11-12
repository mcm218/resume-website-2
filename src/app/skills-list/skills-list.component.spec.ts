import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Skill } from '../models/skill';

import { SkillsListComponent } from './skills-list.component';

describe('SkillsListComponent', () => {
  let component: SkillsListComponent;
  let fixture: ComponentFixture<SkillsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a title', () => {
    component.title = "Test Title";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const h3Element = componentElement.querySelector ('h3')!;
    expect(h3Element.textContent).toContain (component.title);
  })
  
  it('should have a list of skills', () => {
    component.skills = new Array <Skill> ();
    component.skills.push (new Skill ());
    component.skills.push (new Skill ());
    component.skills.push (new Skill ());
    component.skills.push (new Skill ());

    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();
    expect(ulElement.children.length).toEqual (component.skills.length);
  })

  
  it('should have no notes', () => {
    component.skills = new Array <Skill> ();
    
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();
    expect (ulElement.children.length).toEqual (0);
  })
});
