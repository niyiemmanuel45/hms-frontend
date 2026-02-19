import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsLogoComponent } from './patients-logo.component';

describe('PatientsLogoComponent', () => {
  let component: PatientsLogoComponent;
  let fixture: ComponentFixture<PatientsLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientsLogoComponent]
    });
    fixture = TestBed.createComponent(PatientsLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
