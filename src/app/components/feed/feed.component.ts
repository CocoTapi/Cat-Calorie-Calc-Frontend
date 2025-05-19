import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CurrentFeedStatusComponent } from './current-feed-status/current-feed-status.component';
import { CardComponent } from "../../ui/card/card.component";
import { CalorieCounterComponent } from './calorie-counter/calorie-counter.component';

@Component({
  selector: 'app-feed',
  imports: [DatePipe, CurrentFeedStatusComponent, CardComponent, CalorieCounterComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  today: number = Date.now();
  petName: string = 'Dodger';
  requiredCalories: number = 120;
  totalCalories: number = 240;


}
