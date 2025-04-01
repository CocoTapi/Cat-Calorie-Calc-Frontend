import { Component, computed, inject, signal, input, AfterViewInit } from '@angular/core';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { PetFormComponent } from "./pet-form/pet-form.component";
import { MatIconModule } from '@angular/material/icon';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { CommonConstants } from '../app.constants';
import { FormGroup } from '@angular/forms';
import { Pet_Form_Data, Pet_Profile } from './models/pet-profile.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-pet-profile',
  imports: [PetFormComponent, MatIconModule, SlidePanelComponent, CardComponent],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent implements AfterViewInit {
  id = input<number>(0);
  private petProfileService = inject(PetProfileService);
  private slidePanelService = inject(SlidePanelService);
  panelId: string = CommonConstants.PET_FORM;

  // Get pet data by pet id
  private _pet = toSignal<Pet_Profile | undefined>(
    this.petProfileService.getPetByPetId(this.id()).pipe(
      catchError((error) => {
        console.error('Error fetching Pet_Profile:', error);
        return of(undefined);
      })
    ),
    { initialValue: undefined }
  );

  // Set read only pet data to use
  readonly pet = computed(() => {
    const pet = this._pet();
    if (!pet) throw new Error('Pet not loaded yet or failed to load.');
    return pet;
  });

  // Edit pet data validation to submit
  formValid: boolean = false;
  petFormGroup!: FormGroup;

  // When user close the edit slide page, check the form validation and tell if it's allow to close
  ngAfterViewInit(): void {
    // Register canClose condition for the 'form' panel
    this.slidePanelService.canClose(this.panelId, () => this.canPanelClose());
  }

  showEditPage = signal(false);




  // ------ For pet profile ------

  // Setup pet's icon picture
  imagePath = computed(() => {
    const url = this.pet()?.icon;

    // Return default img
    if(!url) return 'pets/paw.png'

    // Return user's img
    return 'pets/' + this.pet().icon;
  });

  // Calculate pet's age from birthday
  age = computed(() => {
    const birthday = this.pet()?.birthday;
    
    // Return default age
    if (!birthday) return 0;

    // Subtract birthday from today's date
    const today = new Date();
    let age = today.getFullYear() - birthday!.getFullYear();
    const monthDiff = today.getMonth() - birthday!.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday!.getDate())) {
      age--;
    }

    return age;
  });

  // Setup line graph title based on pet's goal
  graphTitle = computed(() => {
    let goal = this.pet()?.goal;

    // Return default goal
    if(!goal) goal = 'Maintain'

    let title = `Goal: ${goal} Weight`;
    const targetWeight = this.pet()?.target_weight;    

    // Return default title
    if(!targetWeight) return title;

    let unit = this.pet()?.weight_unit;

    // Set default unit
    if(!unit) unit = 'lb'
    
    title = `Goal: ${goal} Weight to ${targetWeight} ${unit}`

    return title;
  });




  // ----- edit form -----

  // Receive form validation to edit page
  onFormValidityChange(valid: boolean) {
    this.formValid = valid;
  }

  // Receive form data from edit page 
  onFormGroupChange(form: FormGroup) {
    this.petFormGroup = form;
  }
  // Open edit slide
  onEdit(panelId: string) {
    this.slidePanelService.open(panelId);
  }

  // When the panel close, send a request to update pet profile 
  canPanelClose(): boolean {
    // Check validation
    if (!this.formValid) {
      return false; 
    }

    // Remake form data with user id
    const formData: Pet_Form_Data = {
      id: this.id(),
      ...this.petFormGroup.value
    }

    // If allergies are not assigned, put default
    if (!formData.allergies.length) {
      formData.allergies = 'none';
    }

    // Send edit request to service 
    this.petProfileService.editPetData(formData);
    return true;
  }

}
