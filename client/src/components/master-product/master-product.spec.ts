import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProduct } from './master-product';

describe('MasterProduct', () => {
  let component: MasterProduct;
  let fixture: ComponentFixture<MasterProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
