import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceItem } from '../models/experience-item';

import { ExperienceListComponent } from './experience-list.component';

describe('ExperienceListComponent', () => {
  let component: ExperienceListComponent;
  let fixture: ComponentFixture<ExperienceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a title', () => {
    component.role.title = "Test Title"
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const h2Element = componentElement.querySelector ('h2')!;
    expect(h2Element.textContent).toContain (component.role.title);
  })
  
  
  it('should have a list of experience cards', () => {
    component.role.experience = new Array <ExperienceItem> ();
    component.role.experience.push (new ExperienceItem ());
    component.role.experience.push (new ExperienceItem ());
    component.role.experience.push (new ExperienceItem ());
    component.role.experience.push (new ExperienceItem ());

    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();
    expect(ulElement.children.length).toEqual (component.role.experience.length);
  })

  
  it('should have no notes', () => {
    component.role.experience = new Array <ExperienceItem> ();
    
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();
    expect (ulElement.children.length).toEqual (0);
  })
});
