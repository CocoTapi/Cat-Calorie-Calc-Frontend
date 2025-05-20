import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodBoxComponent } from './food-box.component';
import { CommonConstants } from '../../app.constants';

describe('FoodBoxComponent', () => {
  let component: FoodBoxComponent;
  let fixture: ComponentFixture<FoodBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use food icon by default when foodType is not TREAT', () => {
    component.name = 'Cat Food';
    component.foodType = 'food'; 
    fixture.detectChanges();

    expect(component.icon).toBe(CommonConstants.FOOD_ICON);
  });

  it('should use treat icon when foodType is treat', () => {
    component.name = 'Cat Treat';
    component.foodType = 'treat'; 
    fixture.detectChanges();

    expect(component.icon).toBe(CommonConstants.TREAT_ICON);
  });


});
