import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

import { PhonePipePipe } from '../phone-pipe.pipe';
import { ContactMe } from '../models/contact-me';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactComponent, PhonePipePipe ],
      imports: [ FontAwesomeModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an email link', () => {
    component.contact.email = "test@email.com";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const email = componentElement.querySelector <HTMLAnchorElement> ('#email')!;
    expect(email.href).toContain (`mailto:${component.contact.email}`);
  })

  it('should have a LinkedIn link', () => {
    component.contact.linkedin = "https://linkedin.com";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const linkedin = componentElement.querySelector <HTMLAnchorElement> ('#linkedin')!;
    expect(linkedin.href).toContain (component.contact.linkedin);
  })

  it('should have a Github link', () => {
    component.contact.github = "https://github.com";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const github = componentElement.querySelector <HTMLAnchorElement> ('#github')!;
    expect(github.href).toContain (component.contact.github);
  })

  it('shouldn\'t have an email link', () => {
    component.contact.email = "";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const email = componentElement.querySelector ('#email')!;
    expect(email).toBeFalsy ();
  })

  it('shouldn\'t have a LinkedIn link', () => {
    component.contact.linkedin = "";
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const linkedin = componentElement.querySelector ('#linkedin')!;
    expect(linkedin).toBeFalsy ();
  })

  it('shouldn\'t have a Github link', () => {
    component.contact.github = "";
    fixture.detectChanges();
    
    const componentElement: HTMLElement = fixture.nativeElement;
    const github = componentElement.querySelector ('#github')!;
    expect(github).toBeFalsy ();
  })
});
