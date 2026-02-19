import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTransactionComponent } from './patient-transaction.component';

describe('PatientTransactionComponent', () => {
  let component: PatientTransactionComponent;
  let fixture: ComponentFixture<PatientTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientTransactionComponent]
    });
    fixture = TestBed.createComponent(PatientTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
