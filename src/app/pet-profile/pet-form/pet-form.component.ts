import { ChangeDetectionStrategy, Component, OnInit, Input, DestroyRef, inject, Output, EventEmitter } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MedItemType, Pet_Form_Data, Pet_Profile, UnitType } from '../models/pet-profile.model';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomInputComponent } from "../../ui/custom-input/custom-input.component";
import { CustomSelectionComponent, SELECTION } from '../../ui/custom-selection/custom-selection.component';
import { CommonConstants } from '../../app.constants';
import { DatePickerComponent } from "../../ui/date-picker/date-picker.component";
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { createPetProfileForm, getInitialPetProfile } from './pet-profile-form';

@Component({
  selector: 'app-pet-form',
  imports: [
    FormsModule,          
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatIconModule,
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
  private slidePanelService = inject(SlidePanelService);

  @Input() pet!: Pet_Profile;
  @Output() formValidationChange = new EventEmitter<boolean>(); 
  @Output() formGroupData = new EventEmitter<FormGroup>(); 

  private _petProfileForm!: FormGroup;

  get petProfileForm(): FormGroup {
    if (!this._petProfileForm) throw new Error('property _petProfileForm does not exist!');
    return this._petProfileForm;
  }
  set petProfileForm(value: FormGroup) {
    this._petProfileForm = value;
  }

  // output form validation 

  goalSelection: SELECTION[] = [
    { value: CommonConstants.MAINTAIN, viewValue: 'Maintain' },
    { value: CommonConstants.LOSE, viewValue: 'Lose' },
    { value: CommonConstants.GAIN, viewValue: 'Gain' },
  ]

  // TODO: get user's pet amount 
  newId: number = Math.random();

  // TODO: initial birthday
  //defaultBirthday: Date = new Date();

  ngOnInit(): void {
    // Setup initial form values
    const initialPetProfile: Pet_Form_Data = getInitialPetProfile(this.pet, this.newId)

    // Setup pet profile form 
    this.petProfileForm = createPetProfileForm(initialPetProfile)

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


    // Send validation to parent
    const validationSubscription = this.petProfileForm.statusChanges.subscribe(() => {
      this.formValidationChange.emit(this.petProfileForm.valid);
    });

    // send form data to parent
    const dataSubscription = this.petProfileForm.statusChanges.subscribe(() => {
      this.formGroupData.emit(this.petProfileForm);
    });

    this.destroyRef.onDestroy(() => validationSubscription?.unsubscribe());
    this.destroyRef.onDestroy(() => dataSubscription?.unsubscribe());


  }

  // ------  FUNCTIONS FOR ALL   ------

   // Getter for Form Controls to access form values
   getFormControl(fieldName: string): FormControl {
    const fieldControl = this.petProfileForm.get(fieldName) as FormControl;
    if (!fieldControl) throw new Error(`${fieldName} is missing in petProfileForm. Result: ${fieldControl}`);

    return fieldControl;
  }

  // ------  FUNCTIONS FOR WEIGHT  ------

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

 

  // ------ FUNCTIONS FOR MEDICATION  ------

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
    }, Validators.required));
  }

  // TODO: display invalid when the user open the medication slot but close the panel without touch them 

  // Remove a medication by index
  removeMedication(index: number) {
    this.medications.removeAt(index);
  }

  // ------ FUNCTIONS FOR SUBMIT  ------

  onSubmit() {
    // Close this slide
    this.slidePanelService.close;
  }


}