import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopPointsDiscoveryComponent } from './stop-points-discovery.component';

describe('StopPointsDiscoveryComponent', () => {
  let component: StopPointsDiscoveryComponent;
  let fixture: ComponentFixture<StopPointsDiscoveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopPointsDiscoveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopPointsDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
