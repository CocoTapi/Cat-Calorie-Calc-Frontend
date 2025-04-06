import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonConstants, PET_DEFAULT, UNIT_TYPES } from '../../../app.constants';

export interface PetFormData {
  species: PetSpecies;
  name: string;
  birthday: Date;

  weight: number;
  weight_unit: WeightUnit;

  allergies: string;
  medications: PetFormMedication[];

  goal: GoalType;
  target_weight: number;

  factor: number;
  daily_calories: number;

  notes: string;
}

export interface PetFormMedication {
  med_id: number;
  med_name: string;
  directions: string;
}

export interface Suggested_Factor {
  Maintain: number;
  Lose: number;
  Gain: number;
}

export type GoalKeys = keyof Suggested_Factor; // 'Maintain' | 'Lose' | 'Gain'

export interface PetProfile extends PetFormData {
  id: number;
  icon: string;
}

export type MedItemType =
  | typeof CommonConstants.MED_NAME
  | typeof CommonConstants.DIRECTIONS;


export type WeightUnit = typeof UNIT_TYPES.WEIGHT_UNITS[keyof typeof UNIT_TYPES.WEIGHT_UNITS];

// export enum GoalType {
//   MAINTAIN = 'Maintain',
//   GAIN = 'Gain',
//   LOSE = 'Lose',
// }

// export enum PetSpecies {
//   CAT = 'cat',
//   DOG = 'dog',
// }

export type GoalType = 'Maintain' | 'Gain' | 'Lose'

export type PetSpecies = 'cat' | 'dog'

export interface DisplayAge {
  months: number;
  years: number
}

export interface PetProfileForm {
  species: FormControl<PetSpecies>;
  name: FormControl<string>;
  birthday: FormControl<Date>;
  weight: FormControl<number>;
  weight_unit: FormControl<WeightUnit>;
  allergies: FormControl<string | null>;
  medications: FormArray<MedicationFormGroup>;
  goal: FormControl<GoalType>;
  target_weight: FormControl<number | null>;
  factor: FormControl<number>;
  daily_calories: FormControl<number>;
}

export type MedicationFormGroup = FormGroup<{
  med_id: FormControl<number>;
  med_name: FormControl<string>;
  directions: FormControl<string>;
}>;

export const PetProfileFormControls: {
  [K in keyof PetProfileForm]: PetProfileForm[K]
} = {
  species: new FormControl(PET_DEFAULT.species, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  name: new FormControl(PET_DEFAULT.name, {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(1), Validators.pattern(/\S+/)]
  }),
  birthday: new FormControl(PET_DEFAULT.birthday, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  weight: new FormControl(PET_DEFAULT.weight, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)]
  }),
  weight_unit: new FormControl(PET_DEFAULT.weight_unit, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  allergies: new FormControl(PET_DEFAULT.allergies ?? null),
  medications: new FormArray<MedicationFormGroup>([]),
  goal: new FormControl(PET_DEFAULT.goal, {
    nonNullable: true,
    validators: [Validators.required]
  }),
  target_weight: new FormControl(PET_DEFAULT.target_weight, {
    validators: [Validators.min(0)]
  }),
  factor: new FormControl(PET_DEFAULT.factor, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0.5), Validators.max(2.0)]
  }),
  daily_calories: new FormControl(PET_DEFAULT.daily_calories, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)]
  })
};

