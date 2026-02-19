import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabReportPatientComponent } from './lab-report-patient.component';

describe('LabReportPatientComponent', () => {
  let component: LabReportPatientComponent;
  let fixture: ComponentFixture<LabReportPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabReportPatientComponent]
    });
    fixture = TestBed.createComponent(LabReportPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
