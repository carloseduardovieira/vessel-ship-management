/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VesselRouteListComponent } from './vessel-route-list.component';

describe('VesselRouteListComponent', () => {
  let component: VesselRouteListComponent;
  let fixture: ComponentFixture<VesselRouteListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselRouteListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselRouteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
