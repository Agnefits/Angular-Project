import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProduct } from './detail-product';

describe('DetailProduct', () => {
  let component: DetailProduct;
  let fixture: ComponentFixture<DetailProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailProduct],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailProduct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
