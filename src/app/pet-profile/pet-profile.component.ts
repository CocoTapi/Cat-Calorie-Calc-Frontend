import { Component, computed, inject, signal, input, AfterViewInit, OnInit } from '@angular/core';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { PetFormComponent } from "./pet-form/pet-form.component";
import { MatIconModule } from '@angular/material/icon';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { CommonConstants } from '../app.constants';
import { FormGroup } from '@angular/forms';
import { Pet_Form_Data, Pet_Profile } from './models/pet-profile.model';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-pet-profile',
  imports: [PetFormComponent, MatIconModule, SlidePanelComponent, CardComponent],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent implements AfterViewInit, OnInit {
  id = input<number>(0);
  private _pet = signal<Pet_Profile | undefined>(undefined);

  private petProfileService = inject(PetProfileService);
  private slidePanelService = inject(SlidePanelService);
  panelId: string = CommonConstants.PET_FORM;

  // Get pet data by pet id
  ngOnInit() {
    this.petProfileService.getPetByPetId(this.id()).pipe(
      catchError(error => {
        console.error('Error loading pet:', error);
        return of(undefined);
      })
    ).subscribe(pet => {
      this._pet.set(pet);
    });
  }

  // Set read only pet data to use
  readonly pet = computed(() => {
    const pet = this._pet();
    if (!pet) throw new Error('Pet not loaded yet or failed to load.');
    return pet;
  });
 


  // For edit pet data use
  formValid: boolean = false;
  petFormGroup!: FormGroup;
  showEditPage: boolean = false;

  // When user close the edit slide page, check the form validation and tell if it's allow to close
  ngAfterViewInit(): void {
    // Register canClose condition for the 'form' panel
    this.slidePanelService.canClose(this.panelId, () => this.canPanelClose());
  }

  


  // ------ For pet profile ------

  // Setup pet's icon picture
  imagePath = computed(() => {
    const url = this.pet()?.icon;

    // Return default img
    if(!this.pet() || url.length < 1) return 'pets/paw.png'

    // Return user's img
    return 'pets/' + this.pet().icon;
  });

  // Calculate pet's age from birthday
  age = computed(() => {
     // Return default age
     if (!this.pet()) return 0;

    const birthday = this.pet()?.birthday;

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
    let title = `Goal: Maintain Weight`
    const goal = this.pet()?.goal;

    // Return default goal
    if(!this.pet() || goal === CommonConstants.MAINTAIN) {
      return title;
    }

    const targetWeight = this.pet()?.target_weight;    

    // Return goal title without target weight
    const currentWeight = this.pet()?.weight;
    if(!targetWeight || targetWeight === currentWeight) {
      return `Goal: ${goal} Weight`;
    }

    let unit = this.pet()?.weight_unit;

    // Set default unit
    if(!unit) unit = 'lb';
    
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
    console.log(this.formValid)
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
