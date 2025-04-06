import { AbstractControl, FormGroup } from "@angular/forms";

// Custom validator function
export function medicationValidator(control: AbstractControl){
    const group = control as FormGroup;
    const medName = group.get('med_name')?.value;
    const directions = group.get('directions')?.value;

    return medName && !directions ? { directionsRequired: true } : null;
}