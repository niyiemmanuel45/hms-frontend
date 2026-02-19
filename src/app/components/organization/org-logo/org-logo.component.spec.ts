import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgLogoComponent } from './org-logo.component';

describe('OrgLogoComponent', () => {
  let component: OrgLogoComponent;
  let fixture: ComponentFixture<OrgLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgLogoComponent]
    });
    fixture = TestBed.createComponent(OrgLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
