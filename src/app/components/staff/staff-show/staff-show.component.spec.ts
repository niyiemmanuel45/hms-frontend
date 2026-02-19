import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffShowComponent } from './staff-show.component';

describe('StaffShowComponent', () => {
  let component: StaffShowComponent;
  let fixture: ComponentFixture<StaffShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffShowComponent]
    });
    fixture = TestBed.createComponent(StaffShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
