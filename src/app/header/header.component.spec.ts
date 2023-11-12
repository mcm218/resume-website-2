import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent, PropertyType } from './header.component';

import { ContactComponent } from '../contact/contact.component';
import { EducationCardComponent } from '../education-card/education-card.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { ContactMe } from '../models/contact-me';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

declare const viewport: any;

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FontAwesomeModule],
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const h1Element = componentElement.querySelector('h1')!;
    expect(h1Element.textContent).toContain(component.title);
  });

  it('should have a subtitle', () => {
    component.subtitle = 'Test Subtitle';
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const h2Element = componentElement.querySelector('h2')!;
    expect(h2Element.textContent).toContain(component.subtitle);
  });

  it('test onScroll', () => {
    component.isInitialized = false;
    fixture.detectChanges();

    expect(component.onScroll(undefined)).toBeFalsy();

    component.isInitialized = true;
    fixture.detectChanges();

    expect(component.onScroll(undefined)).toBeTruthy();
  });

  it('height should adjust with scroll value: desktop', () => {
    viewport.set(1920, 1080);

    const componentElement: HTMLElement = fixture.nativeElement;
    const headerElement =
      componentElement.querySelector<HTMLDivElement>('#header-overlay')!;

    // Test at 0%
    window.scrollBy(0, component.finalScrollDistance * 0);
    fixture.detectChanges();

    component.headerElement.nativeElement.style.height =
      component.UpdatePropertyOnScroll(
        PropertyType.height,
        component.headerValues
      );

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 50%
    window.scrollBy(0, component.finalScrollDistance * 0.5);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 100%
    window.scrollBy(0, component.finalScrollDistance);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 150%;
    window.scrollBy(0, component.finalScrollDistance * 1.5);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 0%, again
    window.scrollBy(0, component.finalScrollDistance * 0);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );
  });

  it('height should adjust with scroll value: mobile', () => {
    viewport.set(500, 500);
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const headerElement =
      componentElement.querySelector<HTMLDivElement>('#header-overlay')!;

    // Test at 0%
    window.scrollBy(0, component.finalScrollDistance * 0);
    fixture.detectChanges();

    component.headerElement.nativeElement.style.height =
      component.UpdatePropertyOnScroll(
        PropertyType.height,
        component.headerValues
      );

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 50%
    window.scrollBy(0, component.finalScrollDistance * 0.5);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 100%
    window.scrollBy(0, component.finalScrollDistance);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 150%;
    window.scrollBy(0, component.finalScrollDistance * 1.5);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );

    // Test at 0%, again
    window.scrollBy(0, component.finalScrollDistance * 0);
    fixture.detectChanges();

    expect(headerElement.style.height).toEqual(
      component.headerElement.nativeElement.style.height
    );
  });

  // #TODO: test font size, opacity, color, and background color
});
