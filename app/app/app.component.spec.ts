import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WipAlertComponent } from './wip-alert/wip-alert.component';
import JsonData from '../assets/me.json';
import { environment } from '../environments/environment.js';

import {
  addDoc,
  collectionData,
  doc,
  docData,
  Firestore,
  FirestoreModule,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

declare const viewport: any;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have set heights for mobile`, () => {
    viewport.set(500, 500);
    component.ngAfterViewInit();
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;

    let underlayElement =
      componentElement.querySelector<HTMLDivElement>('#mobile-underlay')!;
    let underlayHeightString = underlayElement.style.height;

    let containerElement =
      componentElement.querySelector<HTMLDivElement>('#app-container')!;
    let appContainerBgSizeString = containerElement.style.backgroundSize;

    expect(underlayHeightString).toBe(window.screen.availHeight + 'px');
    expect(appContainerBgSizeString).toBe(
      'auto ' + window.screen.availHeight + 'px'
    );
  });
});
