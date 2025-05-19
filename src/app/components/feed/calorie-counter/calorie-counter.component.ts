import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calorie-counter',
  imports: [],
  templateUrl: './calorie-counter.component.html',
  styleUrl: './calorie-counter.component.scss'
})
export class CalorieCounterComponent {
  @Input() title!: string;
}
