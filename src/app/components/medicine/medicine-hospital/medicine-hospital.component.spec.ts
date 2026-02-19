import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineHospitalComponent } from './medicine-hospital.component';

describe('MedicineHospitalComponent', () => {
  let component: MedicineHospitalComponent;
  let fixture: ComponentFixture<MedicineHospitalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicineHospitalComponent]
    });
    fixture = TestBed.createComponent(MedicineHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
