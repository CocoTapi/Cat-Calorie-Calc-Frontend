import { Component, computed, inject, signal } from '@angular/core';
import { CardComponent } from "../ui/card/card.component";
import { PetProfileService } from '../services/pet-profile.service';
import { PetFormComponent } from "./pet-form/pet-form.component";

@Component({
  selector: 'app-pet-profile',
  imports: [CardComponent, PetFormComponent],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent {
  private petProfileService = inject(PetProfileService);
  showEditPage = signal(false);
  pet = this.petProfileService.pet;
  imagePath = computed(() => 'pets/' + this.pet().icon);
  age = computed(() => {
    const birthday = new Date(this.pet().birthday);
    const today = new Date();
    
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--; 
    }

    return age;
  });
  graphTitle = computed(() => {
    let title = `Goal: ${this.pet().goal} weight`;

    if (this.pet().target_weight) {
      title = `Goal: ${this.pet().goal} Weight to ${this.pet().target_weight} ${this.pet().weight_unit}`
    }

    return title;
  });

  onEdit() {
    this.showEditPage.set(!this.showEditPage());
  }
  
}
