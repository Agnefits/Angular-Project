import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cart } from './cart';

describe('cart', () => {
  let component: cart;
  let fixture: ComponentFixture<cart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [cart],
    }).compileComponents();

    fixture = TestBed.createComponent(cart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
