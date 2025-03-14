import { ChangeDetectionStrategy, Component, signal, OnInit, Input, DestroyRef, inject } from '@angular/core';
import { CardComponent } from "../../ui/card/card.component";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Pet_Form_DATA, Pet_Profile } from '../models/pet-profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { medicationValidator } from './pet-form-validators';


@Component({
  selector: 'app-pet-form',
  imports: [
    CardComponent,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  title = signal('Pet Profile');
  @Input() pet!: Pet_Profile;
  petProfileForm!: FormGroup;

  ngOnInit(): void {
    // Setup initial form values
    const initialPetProfile: Pet_Form_DATA = {
      id: this.pet?.id ?? null,
      type: this.pet?.type ?? 'cat',
      name: this.pet?.name ?? '',
      birthday: this.pet?.birthday ?? null,

      weight: this.pet?.weight ?? null,
      weight_unit: this.pet?.weight_unit ?? 'lb',

      allergies: this.pet?.allergies ?? '',
      medications: this.pet?.medications ?? [],

      goal: this.pet?.goal ?? 'Maintain',
      target_weight: this.pet?.target_weight ?? null,

      factor: this.pet?.factor ?? '1.0',
      daily_calories: this.pet?.daily_calories ?? null,

      notes: this.pet?.notes ?? '',
    };

    // Setup reactive form group
    this.petProfileForm = new FormGroup({
      type: new FormControl(initialPetProfile.type, Validators.required),
      name: new FormControl(initialPetProfile.name, Validators.required),
      birthday: new FormControl(initialPetProfile.birthday, Validators.required),

      weight: new FormControl(initialPetProfile.weight, Validators.required),
      weight_unit: new FormControl(initialPetProfile.weight_unit, Validators.required),

      allergies: new FormControl(initialPetProfile.allergies),
      medications: new FormArray(
        initialPetProfile.medications.map(med => new FormGroup({
          med_id: new FormControl(med.med_id),
          med_name: new FormControl(med.med_name),
          directions: new FormControl(med.directions)
        }))
      ),

      goal: new FormControl(initialPetProfile.goal, Validators.required),
      target_weight: new FormControl(initialPetProfile.target_weight),

      factor: new FormControl(initialPetProfile.factor, Validators.required),
      daily_calories: new FormControl(initialPetProfile.daily_calories, Validators.required),
    });

    // Listen for changes in 'goal' and update 'factor'
    const subscriptionForGoal = this.petProfileForm.get('goal')?.valueChanges.subscribe(goal => {
      const factorControl = this.petProfileForm.get('factor');

      switch (goal) {
        case 'Maintain':
          factorControl?.setValue(1.2);
          break;
        case 'Lose':
          factorControl?.setValue(0.8);
          break;
        case 'Gain':
          factorControl?.setValue(1.1);
          break;
        default:
          factorControl?.setValue('');
      }
    });
    
    this.destroyRef.onDestroy(() => subscriptionForGoal?.unsubscribe());

    // Listen for changes in 'factor' and update 'daily_calories'
    const subscriptionForFactor = this.petProfileForm.get('factor')?.valueChanges.subscribe(factor => {
      const dailyCaloriesControl = this.petProfileForm.get('daily_calories');
      const weightControl = this.petProfileForm.get('weight');
      const weightUnitControl = this.petProfileForm.get('weight_unit');

      // Ensure controls exist before proceeding
      if (!weightControl || !weightUnitControl || !dailyCaloriesControl) {
        return;
      }

      let currentWeightInKg = weightControl.value;

      // Convert lb to kg
      if (weightUnitControl.value === 'lb') {
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

    this.destroyRef.onDestroy(() => subscriptionForFactor?.unsubscribe());

  }

  // Getter for weight_unit
  get unit() {
    return this.petProfileForm.get('weight_unit')?.value;
  }

  // Getter for medications' FormArray
  get medications() {
    return this.petProfileForm.get('medications') as FormArray;
  }

  // Add a new medication
  addMedication() {
    this.medications.push(new FormGroup({
      med_id: new FormControl(this.medications.length),
      med_name: new FormControl(''),
      directions: new FormControl('')
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

    const formData: Pet_Form_DATA = {
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