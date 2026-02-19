import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgEditComponent } from './org-edit.component';

describe('OrgEditComponent', () => {
  let component: OrgEditComponent;
  let fixture: ComponentFixture<OrgEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgEditComponent]
    });
    fixture = TestBed.createComponent(OrgEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
