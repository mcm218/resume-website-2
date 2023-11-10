import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceCardComponent } from './experience-card.component';

describe('ExperienceCardComponent', () => {
  let component: ExperienceCardComponent;
  let fixture: ComponentFixture<ExperienceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperienceCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a company', () => {
    component.item.company = "Test Company";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const companyElement = componentElement.querySelector ('.company')!;
    expect(companyElement.textContent).toContain (component.item.company);
  })
  
  it('shouldn\'t have a company', () => {
    component.item.company = "";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const companyElement = componentElement.querySelector ('.company')!;
    expect(companyElement).toBeFalsy ();
  })
  
  it('should have a role', () => {
    component.item.role = "Test Role";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const sectionElement = componentElement.querySelector ('section')!;
    expect(sectionElement.textContent).toContain (component.item.role);
  })
  
  it('should have a dates', () => {
    component.item.startDate = "a";
    component.item.endDate = "b";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const datesElement = componentElement.querySelector ('.dates')!;
    expect(datesElement.textContent).toContain (`a - b`);
  })
  
  it('shouldn\'t have a dates', () => {
    component.item.startDate = "";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const datesElement = componentElement.querySelector ('.dates')!;
    expect(datesElement).toBeFalsy ();
  })
  
  it('should have a location', () => {
    component.item.location = "Test Location";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const locationElement = componentElement.querySelector ('.location')!;
    expect(locationElement.textContent).toContain (component.item.location);
  })
  
  it('should have a list of notes', () => {
    component.item.notes = new Array <string> ();
    component.item.notes.push ("item 0");
    component.item.notes.push ("item 1");
    component.item.notes.push ("item 2");
    component.item.notes.push ("item 3");

    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();

    let index = 0;
    component.item.notes.forEach(note => {
      expect (ulElement.children [index].textContent).toContain (note);
      index++;
    });
  })

  
  it('should have no notes', () => {
    component.item.notes = new Array <string> ();
    
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const ulElement = componentElement.querySelector <HTMLUListElement> ('ul')!;
    expect(ulElement).toBeTruthy ();
    expect (ulElement.children.length).toEqual (0);
  })
});
