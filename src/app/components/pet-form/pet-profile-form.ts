import { FormControl, FormGroup, Validators } from "@angular/forms";
import { PetProfileForm, PetFormData, PetProfileFormControls } from "../pet-profile/models/pet-profile.model";

/**
 * Patches a PetProfileForm FormGroup with provided PetFormData data
 */
export function patchPetProfileForm(
  form: FormGroup<PetProfileForm>,
  data: PetFormData
) {
  form.patchValue({
    species: data.species,
    name: data.name,
    birthday: data.birthday,
    weight: data.weight,
    weight_unit: data.weight_unit,
    allergies: data.allergies,
    goal: data.goal,
    target_weight: data.target_weight,
    factor: data.factor,
    daily_calories: data.daily_calories
  });

  form.controls.medications.clear();
  data.medications.forEach(med => {
    form.controls.medications.push(new FormGroup({
      med_id: new FormControl(med.med_id, { nonNullable: true, validators: [Validators.required] }),
      med_name: new FormControl(med.med_name, { nonNullable: true, validators: [Validators.required] }),
      directions: new FormControl(med.directions, { nonNullable: true, validators: [Validators.required] }),
    }));
  });
}

/**
 * Creates a new default PetProfileForm FormGroup
 */
export function createNewPetProfileForm(): FormGroup<PetProfileForm> {
  return new FormGroup<PetProfileForm>({ ...PetProfileFormControls });
}
