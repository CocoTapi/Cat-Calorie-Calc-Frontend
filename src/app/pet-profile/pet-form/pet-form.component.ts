import { ChangeDetectionStrategy, Component, signal, OnInit, Input, DestroyRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MedItemType, Pet_Form_Data, Pet_Profile } from '../models/pet-profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { medicationValidator } from './pet-form-validators';
import { CustomInputComponent } from "../../ui/custom-input/custom-input.component";
import { CustomSelectionComponent, SELECTION } from '../../ui/custom-selection/custom-selection.component';
import { CommonConstants } from '../../app.constants';

@Component({
  selector: 'app-pet-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomInputComponent,
    CustomSelectionComponent
],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  title = signal('Pet Profile');
  @Input() pet!: Pet_Profile;
  // petProfileForm!: FormGroup;

  private _petProfileForm!: FormGroup;

  get petProfileForm():FormGroup {
    if(!this._petProfileForm) throw new Error('property _petProfileForm does not exist!');
    return this._petProfileForm;
  }
  set petProfileForm(value: FormGroup) {
    this._petProfileForm = value;
  }

  goalSelection : SELECTION[] = [
    { value: CommonConstants.MAINTAIN },
    { value: CommonConstants.LOSE },
    { value: CommonConstants.GAIN },
  ]

  // TODO: get user's pet amount 
  newId: number = Math.random();

  ngOnInit(): void {
    // Setup initial form values
    const initialPetProfile: Pet_Form_Data = {
      id: this.pet?.id ?? this.newId,
      species: this.pet?.species ?? CommonConstants.CAT,
      name: this.pet?.name ?? '',
      birthday: this.pet?.birthday ?? null,

      weight: this.pet?.weight ?? null,
      weight_unit: this.pet?.weight_unit ?? CommonConstants.LB,

      allergies: this.pet?.allergies ?? '',
      medications: this.pet?.medications ?? [],

      goal: this.pet?.goal ?? CommonConstants.MAINTAIN,
      target_weight: this.pet?.target_weight ?? null,

      factor: this.pet?.factor ?? '1.0',
      daily_calories: this.pet?.daily_calories ?? null,

      notes: this.pet?.notes ?? '',
    };

    // Setup reactive form group
    this.petProfileForm = new FormGroup({
      species: new FormControl(initialPetProfile.species,Validators.required),
      name: new FormControl(initialPetProfile.name, {
        validators:[ Validators.required]
      }),
      birthday: new FormControl(initialPetProfile.birthday, Validators.required),

      weight: new FormControl(initialPetProfile.weight, Validators.required),
      weight_unit: new FormControl(initialPetProfile.weight_unit, Validators.required),

      allergies: new FormControl(initialPetProfile.allergies),
      medications: new FormArray(
        initialPetProfile.medications.map(med => new FormGroup({
          med_id: new FormControl(med.med_id),
          med_name: new FormControl(med.med_name, Validators.required),
          directions: new FormControl(med.directions, Validators.required)
        }))
      ),

      goal: new FormControl(initialPetProfile.goal, Validators.required),
      target_weight: new FormControl(initialPetProfile.target_weight),

      factor: new FormControl(initialPetProfile.factor, Validators.required),
      daily_calories: new FormControl(initialPetProfile.daily_calories, Validators.required),
    });

    // Listen for changes in 'goal' and update 'factor'
    const subscriptionForGoal = this.petProfileForm.get(CommonConstants.GOAL)?.valueChanges.subscribe(goal => {
      const factorControl = this.petProfileForm.get(CommonConstants.FACTOR);

      switch (goal) {
        case CommonConstants.MAINTAIN:
          factorControl?.setValue(1.2);
          break;
        case CommonConstants.LOSE:
          factorControl?.setValue(0.8);
          break;
        case CommonConstants.GAIN:
          factorControl?.setValue(1.1);
          break;
        default:
          factorControl?.setValue(1.0);
      }
    });
    
    this.destroyRef.onDestroy(() => subscriptionForGoal?.unsubscribe());

    // Listen for changes in 'factor' and update 'daily_calories'
    const subscriptionForFactor = this.petProfileForm.get(CommonConstants.FACTOR)?.valueChanges.subscribe(factor => {
      const dailyCaloriesControl = this.petProfileForm.get(CommonConstants.DAILY_CALORIES);
      const weightControl = this.petProfileForm.get(CommonConstants.WEIGHT);
      const weightUnitControl = this.petProfileForm.get(CommonConstants.WEIGHT_UNIT);

      // Ensure controls exist before proceeding
      if (!weightControl || !weightUnitControl || !dailyCaloriesControl) {
        return;
      }

      let currentWeightInKg = weightControl.value;

      // Convert lb to kg
      if (weightUnitControl.value === CommonConstants.LB) {
        currentWeightInKg = currentWeightInKg / 2.2046;
      }

      // Ensure valid inputs  
      if (!currentWeightInKg || !factor) {
        return;
      }

      // Calculate daily calories
      const RER = 70 * Math.pow(currentWeightInKg, 0.75);
      const dailyCalories = (RER * factor).toFixed(1);

      dailyCaloriesControl?.setValue(dailyCalories);
    })

    // TODO: Listen for changes in 'daily_calories' and update 'factor' 

    this.destroyRef.onDestroy(() => subscriptionForFactor?.unsubscribe());
  }

  // Getter for Form Controls to use validations
  getFormControl(fieldName: string): FormControl {
  if (!this.petProfileForm) throw new Error(`petProfileForm is not exist.`);

    return this.petProfileForm.get(fieldName) as FormControl
  }

  // Getter for medications' FormArray
  get medications(): FormArray {
    const medications = this.petProfileForm.get(CommonConstants.MEDICATIONS) as FormArray;
    if (!medications) throw new Error(`property medications does not exist within petProfileForm!`);

    return medications;
  }

  // Getter for each medication name and direction
  getMedItemControl(index: number, medItem: MedItemType): FormControl {
    return this.medications.at(index).get(medItem) as FormControl;
  }

  // if the last medication item is empty, disable add button;
  isAddDisabled(): boolean { 
    if (this.medications.length === 0) {
      return false; // Allow adding first medication
    }
  
    const lastIdx = this.medications.length - 1;
    let lastItemDirections = this.getMedItemControl(lastIdx, CommonConstants.DIRECTIONS);
    lastItemDirections = lastItemDirections?.value.trim();

    return !lastItemDirections // Disable if empty or only spaces
  }

  // Add a new medication
  addMedication() {
    this.medications.push(new FormGroup({
      med_id: new FormControl(this.medications.length),
      med_name: new FormControl('', Validators.required),
      directions: new FormControl('', Validators.required)
    }, medicationValidator));
  }

  // Remove a medication by index
  removeMedication(index: number) {
    this.medications.removeAt(index);
  }

  onSubmit() {
    if (this.petProfileForm.invalid) {
      console.log('INVALID FORM');
      return;
    }

    const formData: Pet_Form_Data = {
      id: this.pet?.id ?? null,
      ...this.petProfileForm.value
    }

    // Remove medications without a `med_name`
    formData.medications = formData.medications.filter(med => 
      med.med_name && med.med_name.trim().length > 0
    )

    console.log("form", formData)
  }
}