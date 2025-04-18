import { Component, computed, inject, signal, input, AfterViewInit, OnInit, DestroyRef, effect, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';
import { CommonConstants } from '../../app.constants';
import { PetProfileService } from '../../services/pet-profile/pet-profile.service';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { CardComponent } from '../../ui/card/card.component';
import { SlidePanelComponent } from '../../ui/slide-panel/slide-panel.component';
import { PetProfile, GoalType, PetFormData, DisplayAge } from './models/pet-profile.model';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { calcMonthYear } from '../../utils/util';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-pet-profile',
  imports: [
    PetFormComponent, 
    MatIconModule, 
    SlidePanelComponent,
    CardComponent, 
    TranslateModule
  ],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent implements AfterViewInit, OnInit {
  id = input.required<number>();
  panelId: string = CommonConstants.PET_FORM;

  private _pet = signal<PetProfile | undefined>(undefined);
  isGoalCorrect = signal<boolean>(true);

  private petProfileService = inject(PetProfileService);
  private slidePanelService = inject(SlidePanelService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Register an effect to check goal correctness whenever pet data changes
    effect(() => {
      const pet = this._pet();
      if (!pet) return;

      const goal = pet.goal;
      const targetWeight = pet.target_weight;
      const currentWeight = pet.weight;

      // Check for special cases
      if (goal === 'Maintain' || targetWeight === currentWeight) {
        this.isGoalCorrect.set(true);
        return;
      }

      // Determine the correct goal based on weights
      let correctGoal: GoalType;
      if (targetWeight > currentWeight) {
        correctGoal = 'Gain';
      } else {
        correctGoal = 'Lose';
      }

      // Update the signal
      this.isGoalCorrect.set(correctGoal === goal);
    });
  }

  // Get pet data by pet id
  ngOnInit() {
    const subscription = this.petProfileService.getPetByPetId(this.id()).pipe(
      catchError(error => {
        console.error('Error loading pet:', error);
        return of(undefined);
      })
    ).subscribe(pet => {
      this._pet.set(pet);
    });

    this.destroyRef.onDestroy(() => subscription?.unsubscribe());
  }

  // Set read only pet data to use
  readonly pet = computed<PetProfile>(() => {
    const pet = this._pet();

    // This keep throwing error until the data arrives
    // This will be thrown at imagePath, age, graphTitle too
    if (!pet) {
      // TODO: loading effect
      throw new Error('Pet not loaded yet or failed to load.')
    }

    return pet;
  });



  // For edit pet data use
  formValid: boolean = false;
  petFormGroup!: FormGroup;
  showEditPage: boolean = false;

  // When user close the edit slide page, check the form validation and tell if it's allow to close
  ngAfterViewInit(): void {
    // Register canClose condition for the 'form' panel
    this.slidePanelService.canClose(
      this.panelId, () => this.canPanelClose()
    );
  }


  // ------ For pet profile ------

  // Setup pet's icon picture
  imagePath = computed(() => {
    const pet = this.pet();
    const url = pet.icon;


    // Return default img
    if (!url || url.length < 1) return 'pets/paw.png'

    // Return user's img
    return 'pets/' + url;
  });

  // Calculate pet's age from birthday
  age: Signal<DisplayAge> = computed(() => {
    const {birthday} = this.pet();
    return calcMonthYear(birthday)
  });

  // Setup line graph title based on pet's goal
  graphTitle = computed(() => {
    const pet = this.pet();
    const goal = pet.goal;

    let title = `Goal: Maintain Weight`

    // Return default goal
    if (goal === 'Maintain') {
      return title;
    }

    const targetWeight = pet.target_weight;
    const currentWeight = pet.weight;
    let unit = pet.weight_unit;
    let realGoal;

    // Return maintain if the target and current weight are same
    if (targetWeight === currentWeight) {
      return title;
    }

    // Determine real goal based on weights
    if (targetWeight > currentWeight) {
      realGoal = 'Gain';
    } else if (targetWeight < currentWeight) {
      realGoal = 'Lose';
    }

    // Set default unit
    if (!unit) unit = 'lb';

    // Display real goal based on weight
    title = `Goal: ${realGoal} Weight to ${targetWeight} ${unit}`

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
      // We don't need to do anything more here as the PetFormComponent will handle showing the errors
      return false;
    }

    // Remake form data with user id
    const formData: PetFormData = {
      id: this.id(),
      ...this.petFormGroup.value
    }

    // Ensure medications is an array
    if (formData.medications && !Array.isArray(formData.medications)) {
      formData.medications = [formData.medications];
    }

    // If allergies are not assigned, put default
    // if (!formData.allergies.length) {
    //   formData.allergies = 'none';
    // }

    // Send edit request to service 
    this.petProfileService.editPetData(formData);

    // Update the local pet data with the edited values
    this._pet.set({
      ...this.pet(),  // Keep existing data
      ...formData     // Apply changes from form
    });

    return true;
  }

}
