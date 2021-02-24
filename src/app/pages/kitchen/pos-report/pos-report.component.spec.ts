import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReportComponent } from './pos-report.component';

describe('PosReportComponent', () => {
  let component: PosReportComponent;
  let fixture: ComponentFixture<PosReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
