import { Component } from '@angular/core';
import { CardComponent } from "./ui/card/card.component";
import { PetProfileComponent } from "./pet-profile/pet-profile.component";

@Component({
  selector: 'app-root',
  imports: [CardComponent, PetProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cat-calorie-calc-frontend';
}
