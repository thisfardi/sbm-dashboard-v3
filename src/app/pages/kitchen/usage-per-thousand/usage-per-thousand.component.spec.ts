import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsagePerThousandComponent } from './usage-per-thousand.component';

describe('UsagePerThousandComponent', () => {
  let component: UsagePerThousandComponent;
  let fixture: ComponentFixture<UsagePerThousandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsagePerThousandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsagePerThousandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
