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

  it('should use dry food icon', () => {
    component.name = 'Purina One';
    component.foodType = 'dryFood'; 
    fixture.detectChanges();

    expect(component.icon).toBe(CommonConstants.DRY_FOOD_ICON);
  });

  it('should use wet food icon', () => {
    component.name = 'Grilled Salmon';
    component.foodType = 'wetFood'; 
    fixture.detectChanges();

    expect(component.icon).toBe(CommonConstants.WET_FOOD_ICON);
  });

  it('should use treat icon when foodType is treat', () => {
    component.name = 'Cat Treat';
    component.foodType = 'treat'; 
    fixture.detectChanges();

    expect(component.icon).toBe(CommonConstants.TREAT_ICON);
  });


});
