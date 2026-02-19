import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCryptographyComponent } from './site-cryptography.component';

describe('SiteCryptographyComponent', () => {
  let component: SiteCryptographyComponent;
  let fixture: ComponentFixture<SiteCryptographyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCryptographyComponent]
    });
    fixture = TestBed.createComponent(SiteCryptographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
