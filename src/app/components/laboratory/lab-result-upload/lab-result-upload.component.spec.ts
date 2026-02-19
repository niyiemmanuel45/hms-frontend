import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultUploadComponent } from './lab-result-upload.component';

describe('LabResultUploadComponent', () => {
  let component: LabResultUploadComponent;
  let fixture: ComponentFixture<LabResultUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabResultUploadComponent]
    });
    fixture = TestBed.createComponent(LabResultUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
