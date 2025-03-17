import { Component } from '@angular/core';
import { PetProfileComponent } from "./pet-profile/pet-profile.component";

@Component({
  selector: 'app-root',
  imports: [PetProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cat-calorie-calc-frontend';
}
