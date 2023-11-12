import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { WipAlertComponent } from './wip-alert.component';

describe('WipAlertComponent', () => {
  let component: WipAlertComponent;
  let fixture: ComponentFixture<WipAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WipAlertComponent ],
      imports: [ FontAwesomeModule ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WipAlertComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a WIP string', () => {
    const componentElement: HTMLElement = fixture.nativeElement;
    const pElement = componentElement.querySelector ('p')!;
    expect(pElement.textContent).toContain ('WIP');
  })

  it('should have a close button', () => {
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const divElement = componentElement.querySelector <HTMLDivElement> ('div')!;
    const buttonElement = componentElement.querySelector <HTMLButtonElement> ('button')!;
    expect(buttonElement.click).toBeTruthy ();

    // Click the button to hide the element
    buttonElement.click ();
    fixture.detectChanges ();

    expect (divElement.style.display).toBe ("none");

    // Reset the display
    divElement.style.display = "block";
    fixture.detectChanges ();

    // Test the method for hiding
    component.close ();
    fixture.detectChanges ();

    expect (divElement.style.display).toBe ("none");
  })
});
