import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedAllotmentComponent } from './bed-allotment.component';

describe('BedAllotmentComponent', () => {
  let component: BedAllotmentComponent;
  let fixture: ComponentFixture<BedAllotmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BedAllotmentComponent]
    });
    fixture = TestBed.createComponent(BedAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
