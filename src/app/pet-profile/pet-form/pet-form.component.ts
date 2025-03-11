import { Component, signal } from '@angular/core';
import { CardComponent } from "../../ui/card/card.component";
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-pet-form',
  imports: [CardComponent, ReactiveFormsModule],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent {
  // TODO: get the page info, edit or new
  title = signal('Edit Profile');

  
  onSubmit() {
    console.log("Submitted")
  }
}
