import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCardComponent } from './skill-card.component';

describe('SkillCardComponent', () => {
  let component: SkillCardComponent;
  let fixture: ComponentFixture<SkillCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    component.title = "Test Title"
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const labelElement = componentElement.querySelector ('label')!;
    expect(labelElement.textContent).toContain (component.title);
  })

  
  
  it('should have a skill value between 0 and 10', () => {
    component.skill = Math.floor (Math.random () * 11);
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const progressElement = componentElement.querySelector <HTMLProgressElement> ('progress')!;
    expect(progressElement.textContent).toContain (component.skill + "/10");
    expect(progressElement.value).toEqual (component.skill);
  })
});
