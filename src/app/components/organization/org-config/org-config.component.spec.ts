import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgConfigComponent } from './org-config.component';

describe('OrgConfigComponent', () => {
  let component: OrgConfigComponent;
  let fixture: ComponentFixture<OrgConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgConfigComponent]
    });
    fixture = TestBed.createComponent(OrgConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
