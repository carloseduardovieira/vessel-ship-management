/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VesselRouteSpeedChartComponent } from './vessel-route-speed-chart.component';

describe('VesselRouteSpeedChartComponent', () => {
  let component: VesselRouteSpeedChartComponent;
  let fixture: ComponentFixture<VesselRouteSpeedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselRouteSpeedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselRouteSpeedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
