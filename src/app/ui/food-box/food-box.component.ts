import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonConstants } from '../../app.constants';
import { FoodType } from '../../utils/food-test-data';

@Component({
  selector: 'app-food-box',
  imports: [MatIconModule],
  templateUrl: './food-box.component.html',
  styleUrl: './food-box.component.scss'
})
export class FoodBoxComponent implements OnInit {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) foodType!: FoodType;

  icon: string = CommonConstants.DRY_FOOD_ICON;

  ngOnInit() {
    if (this.foodType === CommonConstants.TREAT) {
      this.icon = CommonConstants.TREAT_ICON;
    } else if (this.foodType === CommonConstants.WET_FOOD) {
      this.icon = CommonConstants.WET_FOOD_ICON;
    }
  }

}
