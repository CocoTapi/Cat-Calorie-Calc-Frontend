import { Component, computed, inject, signal, input, AfterViewInit } from '@angular/core';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { PetFormComponent } from "./pet-form/pet-form.component";
import { MatIconModule } from '@angular/material/icon';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { CommonConstants } from '../app.constants';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pet-profile',
 imports: [PetFormComponent, MatIconModule, SlidePanelComponent, CardComponent],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent implements AfterViewInit {
  id = input<number>(0);
  panelId: string = CommonConstants.PET_FORM;

  private petProfileService = inject(PetProfileService);
  private slidePanelService = inject(SlidePanelService);

  formValid: boolean = false;
  petFormGroup!: FormGroup;

  ngAfterViewInit(): void {
    // Register canClose condition for the 'form' panel
    this.slidePanelService.canClose(this.panelId, () => this.canPanelClose());
  }


  showEditPage = signal(false);
  pet = signal(this.petProfileService.getPetById(this.id()));

  imagePath = computed(() => 'pets/' + this.pet().icon);

  age = computed(() => {
    const birthday = this.pet().birthday;
    const today = new Date();
    
    let age = today.getFullYear() - birthday!.getFullYear();
    const monthDiff = today.getMonth() - birthday!.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday!.getDate())) {
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


  // ----- edit form -----
  onFormStatusChanged(valid: boolean) {
    this.formValid = valid;
  }
  
  onFormGroupChanged(form: FormGroup) {
    this.petFormGroup = form;
  }

  onEdit(panelId: string) {
    this.slidePanelService.open(panelId);
  }

  canPanelClose(): boolean {
    if (!this.formValid) {
      console.log(this.formValid);
      return false; // This will prevent closing
    }

    // Submit form
    // TODO: set data type
    const formData = {
          id: this.id(),
          ...this.petFormGroup.value
    }

    if (!formData.allergies.length) {
      formData.allergies = 'none';
    }

    console.log('form submitted by closing the panel', formData);
    return true;
  }
  
}
