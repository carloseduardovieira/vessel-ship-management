import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsmListComponent } from './vsm-list.component';

describe('VsmListComponent', () => {
  let component: VsmListComponent;
  let fixture: ComponentFixture<VsmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VsmListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VsmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
