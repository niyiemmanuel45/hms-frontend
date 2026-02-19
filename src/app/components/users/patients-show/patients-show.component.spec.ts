import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsShowComponent } from './patients-show.component';

describe('PatientsShowComponent', () => {
  let component: PatientsShowComponent;
  let fixture: ComponentFixture<PatientsShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientsShowComponent]
    });
    fixture = TestBed.createComponent(PatientsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
