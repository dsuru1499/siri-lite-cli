import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopMonitoringComponent } from './stop-monitoring.component';

describe('StopMonitoringComponent', () => {
  let component: StopMonitoringComponent;
  let fixture: ComponentFixture<StopMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
