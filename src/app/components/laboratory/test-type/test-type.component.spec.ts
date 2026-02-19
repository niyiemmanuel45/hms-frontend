import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTypeComponent } from './test-type.component';

describe('TestTypeComponent', () => {
  let component: TestTypeComponent;
  let fixture: ComponentFixture<TestTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTypeComponent]
    });
    fixture = TestBed.createComponent(TestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
