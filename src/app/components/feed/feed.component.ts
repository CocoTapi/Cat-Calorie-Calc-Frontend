import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from "../../ui/card/card.component";
import { CalorieCounterComponent } from './calorie-counter/calorie-counter.component';
import { FoodBoxComponent } from "../../ui/food-box/food-box.component";
import { CurrentFeedStatusComponent } from "./current-feed-status/current-feed-status.component";

@Component({
  selector: 'app-feed',
  imports: [DatePipe, CardComponent, CalorieCounterComponent, FoodBoxComponent, CurrentFeedStatusComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  today: number = Date.now();
  petName: string = 'Dodger';
  requiredCalories: number = 120;
  totalCalories: number = 240;


}
