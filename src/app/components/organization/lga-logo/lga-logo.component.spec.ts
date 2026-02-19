import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LgaLogoComponent } from './lga-logo.component';

describe('LgaLogoComponent', () => {
  let component: LgaLogoComponent;
  let fixture: ComponentFixture<LgaLogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LgaLogoComponent]
    });
    fixture = TestBed.createComponent(LgaLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
