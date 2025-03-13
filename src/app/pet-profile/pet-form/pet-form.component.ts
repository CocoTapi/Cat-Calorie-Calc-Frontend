import { ChangeDetectionStrategy, Component, signal, input } from '@angular/core';
import { CardComponent } from "../../ui/card/card.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Pet_Profile } from '../models/pet-profile.model';


@Component({
  selector: 'app-pet-form',
  imports: [CardComponent, ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormComponent {
  // TODO: get the page info, edit or new
  title = signal('Edit Profile');
  pet = input<Pet_Profile>();

  petProfileForm = new FormGroup({
    petType: new FormControl('', {
      validators: [Validators.required]
    }),
    // name: new FormControl('', {
    //   validators: [Validators.required]
    // }),
    // birthday: new FormControl('', {
    //   validators: [Validators.required]
    // }),
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
  })
  
  onSubmit() {
    if (this.petProfileForm.invalid){
      console.log('INVALID FORM');
      return;
    }

    console.log("form", this.petProfileForm.controls.petType)
  }
}
