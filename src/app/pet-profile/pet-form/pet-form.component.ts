import { ChangeDetectionStrategy, Component, signal, OnInit, Input, DestroyRef, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MedItemType, Pet_Form_Data, Pet_Profile, UnitType } from '../models/pet-profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { medicationValidator } from './pet-form-validators';
import { CustomInputComponent } from "../../ui/custom-input/custom-input.component";
import { CustomSelectionComponent, SELECTION } from '../../ui/custom-selection/custom-selection.component';
import { CommonConstants } from '../../app.constants';
import { DatePickerComponent } from "../../ui/date-picker/date-picker.component";

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
    CustomSelectionComponent,
    DatePickerComponent
],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  title = signal('Pet Profile');
  @Input() pet!: Pet_Profile;
  private _petProfileForm!: FormGroup;

  get petProfileForm(): FormGroup {
    if (!this._petProfileForm) throw new Error('property _petProfileForm does not exist!');
    return this._petProfileForm;
  }
  set petProfileForm(value: FormGroup) {
    this._petProfileForm = value;
  }

  goalSelection: SELECTION[] = [
    { value: CommonConstants.MAINTAIN, viewValue: 'Maintain' },
    { value: CommonConstants.LOSE, viewValue: 'Lose' },
    { value: CommonConstants.GAIN, viewValue: 'Gain' },
  ]

  // TODO: get user's pet amount 
  newId: number = Math.random();

  // TODO: initial birthday
  defaultBirthday: Date = new Date();

  ngOnInit(): void {
    // Setup initial form values
    const initialPetProfile: Pet_Form_Data = {
      id: this.pet?.id ?? this.newId,
      species: this.pet?.species ?? CommonConstants.CAT,
      name: this.pet?.name ?? '',
      birthday: this.pet?.birthday ?? this.defaultBirthday,

      weight: this.pet?.weight ?? 0,
      weight_unit: this.pet?.weight_unit ?? CommonConstants.LB,

      allergies: this.pet?.allergies ?? '',
      medications: this.pet?.medications ?? [],

      goal: this.pet?.goal ?? CommonConstants.MAINTAIN,
      target_weight: this.pet?.target_weight ?? 0,

      factor: this.pet?.factor ?? 1,
      daily_calories: this.pet?.daily_calories ?? 0,

      notes: this.pet?.notes ?? '',
    };

    // Setup reactive form group
    this.petProfileForm = new FormGroup({
      species: new FormControl(initialPetProfile.species, Validators.required),
      name: new FormControl(initialPetProfile.name, {
        validators: [Validators.required]
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

    // Listen for changes in 'factor' and update 'daily_calories'
    const subscriptionForFactor = this.getFormControl(CommonConstants.FACTOR).valueChanges.subscribe(factor => {
      // Ensure valid inputs  
      if (!factor) return;

      const dailyCaloriesControl = this.getFormControl(CommonConstants.DAILY_CALORIES);

      // Calculate calories
      const RER = this.getRER();
      const newDailyCalories = (RER * factor).toFixed(1);

      // Update 'daily_calories' without triggering valueChanges event
      dailyCaloriesControl.setValue(newDailyCalories, { emitEvent: false });
    })
    this.destroyRef.onDestroy(() => subscriptionForFactor?.unsubscribe());


    // Listen for changes in 'daily_calories' and update 'factor' 
    const subscriptionForCalories = this.getFormControl(CommonConstants.DAILY_CALORIES).valueChanges.subscribe(calories => {
      // Ensure valid inputs  
      if (!calories) return;

      const factorControl = this.getFormControl(CommonConstants.FACTOR);

      // Calculate factor
      const RER = this.getRER();
      const newFactor = (calories / RER).toFixed(1);

      // Update 'factor' without triggering valueChanges event
      factorControl.setValue(newFactor, { emitEvent: false });
    })
    this.destroyRef.onDestroy(() => subscriptionForCalories?.unsubscribe());
  }

  // Get RER
  private getRER(): number {
    const weightControl = this.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = this.getFormControl(CommonConstants.WEIGHT_UNIT);
    const currentWeight = this.getWeightInKg(weightControl.value, weightUnitControl.value);

    // Calculate RER
    const RER = 70 * Math.pow(currentWeight, 0.75);

    return RER;
  }

  // Convert lb to kg
  private getWeightInKg(weight: number, unit: UnitType): number {
    if (!weight) throw new Error('Current weight is missing')

    let current = weight;

    if (unit === CommonConstants.LB) {
      current = current / 2.2046;
    }

    return current;
  }

  // Getter for Form Controls to access form values
  getFormControl(fieldName: string): FormControl {
    const fieldControl = this.petProfileForm.get(fieldName) as FormControl;
    if (!fieldControl) throw new Error(`${fieldName} is missing in petProfileForm. Result: ${fieldControl}`);

    return fieldControl;
  }

  // Getter for medications' FormArray
  get medications(): FormArray {
    const medications = this.petProfileForm.get(CommonConstants.MEDICATIONS) as FormArray;
    if (!medications) throw new Error(`property medications does not exist within petProfileForm!`);

    return medications;
  }

  // Getter for each medication name and direction
  getMedItemControl(index: number, medItem: MedItemType): FormControl {
    const medItemControl = this.medications.at(index).get(medItem) as FormControl;
    if (!medItemControl) throw new Error(`${medItem} is missing in petProfileForm. Result: ${medItemControl}`);

    return medItemControl;
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