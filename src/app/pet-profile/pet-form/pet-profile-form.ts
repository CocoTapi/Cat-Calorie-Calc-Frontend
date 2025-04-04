import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Pet_Form_Data, Pet_Profile } from "../models/pet-profile.model";
import { CommonConstants } from "../../app.constants";

export function getInitialPetProfile(pet: Pet_Profile, newId: number ) {
  const defaultBirthday: Date = new Date();
  
  return {
    id: pet?.id ?? newId,
    species: pet?.species ?? CommonConstants.CAT,
    name: pet?.name ?? '',
    birthday: pet?.birthday ?? defaultBirthday,

    weight: pet?.weight ?? 0,
    weight_unit: pet?.weight_unit ?? CommonConstants.LB,

    allergies: pet?.allergies ?? '',
    medications: pet?.medications ?? [],

    goal: pet?.goal ?? CommonConstants.MAINTAIN,
    target_weight: pet?.target_weight ?? 0,

    factor: pet?.factor ?? 1,
    daily_calories: pet?.daily_calories ?? 0,

    notes: pet?.notes ?? '',
  };
}

export function createPetProfileForm(initialPetProfile: Pet_Form_Data){
  return (
    new FormGroup({
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
    })
  )
}
