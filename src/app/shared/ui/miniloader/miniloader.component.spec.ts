import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniloaderComponent } from './miniloader.component';

describe('MiniloaderComponent', () => {
  let component: MiniloaderComponent;
  let fixture: ComponentFixture<MiniloaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
