import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAnalysisComponent } from './daily-analysis.component';

describe('DailyAnalysisComponent', () => {
  let component: DailyAnalysisComponent;
  let fixture: ComponentFixture<DailyAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
