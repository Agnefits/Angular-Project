import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dashboard } from './dashboard';

describe('dashboard', () => {
  let component: dashboard;
  let fixture: ComponentFixture<dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
