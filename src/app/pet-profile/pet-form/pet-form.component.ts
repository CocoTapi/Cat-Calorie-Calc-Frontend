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
    MatNativeDateModule
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
    const initialPetProfile: Pet_Form_DATA = {
      id: this.pet?.id ?? null,
      type: this.pet?.type ?? 'cat',
      name: this.pet?.name ?? '',
      birthday: this.pet?.birthday ?? null,
      medications: this.pet?.medications ?? [],

      goal: this.pet?.goal ?? 'Maintain',
      factor: this.pet?.factor ?? '1.0',
    };

    this.petProfileForm = new FormGroup({
      type: new FormControl(initialPetProfile.type, Validators.required),
      name: new FormControl(initialPetProfile.name, Validators.required),
      birthday: new FormControl(initialPetProfile.birthday, Validators.required),

      medications: new FormArray([]),

      goal: new FormControl(initialPetProfile.goal, Validators.required),
      factor: new FormControl(initialPetProfile.factor, Validators.required)
    });

    // Listen for changes in 'goal' and update 'factor'
    const subscription = this.petProfileForm.get('goal')?.valueChanges.subscribe(goal => {
      const factorControl = this.petProfileForm.get('factor');

      switch (goal) {
        case 'Maintain':
          factorControl?.setValue(0.9);
          break;
        case 'Reduce':
          factorControl?.setValue(0.8);
          break;
        case 'Gain':
          factorControl?.setValue(1.1);
          break;
        default:
          factorControl?.setValue('');
      }
    });

    this.destroyRef.onDestroy(() => subscription?.unsubscribe());

  }

  // Getter for medications' FormArray
  get medications() {
    return this.petProfileForm.get('medications') as FormArray;
  }

  // Add a new medication
  addMedication() {
    this.medications.push(new FormGroup({
      name: new FormControl('', Validators.required),
      directions: new FormControl('', Validators.required)
    }));
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

    console.log("form", formData)
  }
}

// weight: new FormControl('', {
//   validators: [Validators.required]
// }),
// unit: new FormControl('', {
//   validators: [Validators.required]
// }),
// allergies: new FormControl('', {
//   validators: [Validators.required]
// }),

// medications: new FormGroup({
//   meds_name: new FormControl('', {
//     validators: [Validators.required]
//   }),
//   directions: new FormControl('', {
//     validators: [Validators.required]
//   }),
// }),

// goal: new FormControl('', {
//   validators: [Validators.required]
// }),
// target_weight: new FormControl('', {
//   validators: [Validators.required]
// }),

// factor: new FormControl('', {
//   validators: [Validators.required]
// }),
// daily_calories: new FormControl('', {
//   validators: [Validators.required]
// }),

// notes: new FormControl(''),