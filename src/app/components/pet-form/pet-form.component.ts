import { ChangeDetectionStrategy, Component, OnInit, Input, DestroyRef, inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomInputComponent } from "../../ui/custom-input/custom-input.component";
import { CustomSelectionComponent, SELECTION } from '../../ui/custom-selection/custom-selection.component';
import { CommonConstants } from '../../app.constants';
import { DatePickerComponent } from "../../ui/date-picker/date-picker.component";
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { createNewPetProfileForm, patchPetProfileForm } from './pet-profile-form';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PetProfile, MedItemType } from '../pet-profile/models/pet-profile.model';

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
    DatePickerComponent,
    CommonModule
  ],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetFormComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private slidePanelService = inject(SlidePanelService);
  private cdr = inject(ChangeDetectorRef);

  private factorSubscription: Subscription | undefined;
  private caloriesSubscription: Subscription | undefined;
  private formSubscription: Subscription | undefined;

  @Input() pet!: PetProfile;
  @Input({ required: true }) petId!: number
  @Output() formValidationChange = new EventEmitter<boolean>();
  @Output() formGroupData = new EventEmitter<FormGroup>();

  petProfileForm!: FormGroup;
  showValidationErrors = false;

  // Selection options for goal dropdown
  goalSelection: SELECTION[] = [
    { value: CommonConstants.MAINTAIN, viewValue: 'Maintain' },
    { value: CommonConstants.LOSE, viewValue: 'Lose' },
    { value: CommonConstants.GAIN, viewValue: 'Gain' },
  ]

  ngOnInit(): void {
    // Setup initial form values and form

    this.petProfileForm = createNewPetProfileForm()

    if (this.pet) patchPetProfileForm(this.petProfileForm, this.pet)
    this.emitFormDataValidity();
    this.setupSubscriptions();

    // Register canClose callback to validate form when closing panel
    this.registerPanelCloseValidation();
  }

  /**
   * Registers the validation callback for panel closing
   */
  private registerPanelCloseValidation(): void {
    this.slidePanelService.canClose(CommonConstants.PET_FORM, () => {
      if (!this.petProfileForm.valid) {
        console.log('Form is invalid, preventing panel close');
        this.showFormErrors();
        return false;
      }
      return true;
    });

    // Subscribe to validation trigger events
    const validationSubscription = this.slidePanelService.getValidationTrigger(CommonConstants.PET_FORM)
      .subscribe(() => {
        console.log('Validation trigger received, showing form errors');
        this.showFormErrors();
      });

    this.destroyRef.onDestroy(() => {
      validationSubscription.unsubscribe();
    });
  }

  /**
   * Shows all form validation errors by marking controls as touched and updating UI
   */
  showFormErrors(): void {
    this.showValidationErrors = true;
    this.markAllAsTouched();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.blurAllInputs();
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * Mark all form controls as touched to trigger validation visuals
   */
  markAllAsTouched(): void {
    Object.keys(this.petProfileForm.controls).forEach(key => {
      const control = this.petProfileForm.get(key);
      if (control) {
        control.markAsTouched();
        // Don't mark as dirty - this prevents validation errors from showing too early

        // If it's a FormArray, mark all its children as touched
        if (control instanceof FormArray) {
          control.controls.forEach(item => {
            if (item instanceof FormGroup) {
              Object.keys(item.controls).forEach(childKey => {
                const childControl = item.get(childKey);
                childControl?.markAsTouched();
                // Don't mark as dirty
              });
            } else {
              item.markAsTouched();
              // Don't mark as dirty
            }
          });
        }
      }
    });

    console.log('All form controls marked as touched');
  }

  /**
   * Remove focus from all inputs to show validation errors
   */
  blurAllInputs(): void {
    console.log('Blurring inputs to show validation errors');
    // First try to blur active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Also explicitly blur all input elements in the form
    const formElement = document.querySelector('form.form');
    if (formElement) {
      const inputs = formElement.querySelectorAll('input, textarea, select');
      inputs.forEach((input: Element) => {
        if (input instanceof HTMLElement) {
          input.blur();
        }
      });
    }
  }

  /**
   * Sets up all form subscriptions
   */
  private setupSubscriptions(): void {
    // Factor changes -> update daily calories
    this.factorSubscription = this.getFormControl(CommonConstants.FACTOR).valueChanges.subscribe(factor => {
      if (!factor) return;

      const dailyCaloriesControl = this.getFormControl(CommonConstants.DAILY_CALORIES);
      const RER = this.getRER();
      dailyCaloriesControl.setValue((RER * factor).toFixed(1), { emitEvent: false });
    });

    // Daily calories changes -> update factor
    this.caloriesSubscription = this.getFormControl(CommonConstants.DAILY_CALORIES).valueChanges.subscribe(calories => {
      if (!calories) return;

      const factorControl = this.getFormControl(CommonConstants.FACTOR);
      const RER = this.getRER();
      factorControl.setValue((calories / RER).toFixed(1), { emitEvent: false });
    });

    // Form status changes -> emit validation and data
    this.formSubscription = this.petProfileForm.statusChanges.subscribe(() => {
      this.emitFormDataValidity();

      // Hide validation errors if form becomes valid
      if (this.petProfileForm.valid) {
        this.showValidationErrors = false;
        this.cdr.markForCheck();
      }
    });

    // Cleanup subscriptions
    this.destroyRef.onDestroy(() => {
      this.factorSubscription?.unsubscribe();
      this.caloriesSubscription?.unsubscribe();
      this.formSubscription?.unsubscribe();
    });
  }

  emitFormDataValidity() {
    this.formValidationChange.emit(this.petProfileForm.valid);
    this.formGroupData.emit(this.petProfileForm);
  }

  /**
   * Gets a form control by field name
   * @param fieldName The name of the form control to get
   * @returns The form control
   * @throws Error if the form control doesn't exist
   */
  getFormControl(fieldName: string): FormControl {
    const fieldControl = this.petProfileForm.get(fieldName) as FormControl;
    if (!fieldControl) throw new Error(`${fieldName} is missing in petProfileForm. Result: ${fieldControl}`);

    return fieldControl;
  }

  /**
   * Calculates the Resting Energy Requirement (RER) based on the weight
   * @returns The calculated RER
   */
  private getRER(): number {
    const weightControl = this.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = this.getFormControl(CommonConstants.WEIGHT_UNIT);

    // Get weight in kg
    let weight = weightControl.value;
    if (!weight) return 0;

    // Convert lb to kg if needed
    if (weightUnitControl.value === CommonConstants.LB) {
      weight = weight / 2.2046; //TODO: put this in constants
    }

    // Calculate RER
    return 70 * Math.pow(weight, 0.75); //TODO: change this to use constants and a separate function
  }

  /**
   * Gets the medications FormArray
   * @returns The medications FormArray
   * @throws Error if the medications FormArray doesn't exist
   */
  get medications(): FormArray {
    const medications = this.petProfileForm.get(CommonConstants.MEDICATIONS) as FormArray;
    if (!medications) throw new Error(`property medications does not exist within petProfileForm!`);

    return medications;
  }

  /**
   * Gets a medication item control
   * @param index The index of the medication
   * @param medItem The medication item property name
   * @returns The form control for the medication item
   * @throws Error if the medication item control doesn't exist
   */
  getMedItemControl(index: number, medItem: MedItemType): FormControl {
    const medItemControl = this.medications.at(index).get(medItem) as FormControl;
    if (!medItemControl) throw new Error(`${medItem} is missing in petProfileForm. Result: ${medItemControl}`);

    return medItemControl;
  }

  /**
   * Check if current medications are valid before allowing to add new ones
   * @returns boolean based on if the add button should be disabled
   */
  isAddDisabled(): boolean {
    if (this.medications.length === 0) return false; // Allow adding first medication


    const lastIdx = this.medications.length - 1;
    const lastItemName = this.getMedItemControl(lastIdx, CommonConstants.MED_NAME)?.value?.trim();
    const lastItemDirections = this.getMedItemControl(lastIdx, CommonConstants.DIRECTIONS)?.value?.trim();

    return !lastItemName || !lastItemDirections; // Disable if either field is empty
  }

  /**
   * Adds a new medication to the form
   */
  addMedication() {
    this.medications.push(new FormGroup({
      med_id: new FormControl(this.medications.length),
      med_name: new FormControl('', Validators.required),
      directions: new FormControl('', Validators.required)
    }, Validators.required));
  }

  /**
   * Removes a medication from the form
   * @param index The index of the medication to remove
   */
  removeMedication(index: number) {
    this.medications.removeAt(index);
  }
}