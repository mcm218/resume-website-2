import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationCardComponent } from './education-card.component';

import { Education } from '../models/education';

describe('EducationCardComponent', () => {
  let component: EducationCardComponent;
  let fixture: ComponentFixture<EducationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationCardComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a degree', () => {
    component.education.degree = "Test Degree";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const sectionElement = componentElement.querySelector ('section')!;
    expect(sectionElement.textContent).toContain (component.education.degree);
  })
  
  it('should have a university', () => {
    component.education.university = "Test University";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const sectionElement = componentElement.querySelector ('section')!;
    expect(sectionElement.textContent).toContain (component.education.university);
  })
  
  it('should have an end date', () => {
    component.education.endDate = "Test End Date";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const sectionElement = componentElement.querySelector ('section')!;
    expect(sectionElement.textContent).toContain (component.education.endDate);
  })
});
