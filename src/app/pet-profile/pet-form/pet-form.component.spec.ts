import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFormComponent } from './pet-form.component';
import { PETS_TEST_DATA } from '../../../../public/pets/pets-test-data';
import { ComponentRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { PET_INITIAL_TEST_DATA } from './pet-form-data.spec-helper';
import { Pet_Profile } from '../models/pet-profile.model';
import { CommonConstants } from '../../app.constants';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let componentRef: ComponentRef<PetFormComponent>

  const slidePanelService = {
    close: jasmine.createSpy('close')
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFormComponent, ReactiveFormsModule],
      providers: [
        { provide: SlidePanelService, useValue: slidePanelService }
      ]
    }).compileComponents();
  });
  
  const setup = async (
    petData: Pet_Profile | undefined,
    petId: number
  ) => {
    await TestBed.configureTestingModule({
      imports: [PetFormComponent, ReactiveFormsModule],
      providers: [
        { provide: SlidePanelService, useValue: slidePanelService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('pet', petData);
    componentRef.setInput('petId', `${petId}`);
  };


  // No pet data and petId received but petProfileForm is created
  it('should create component and setup form control', async () => {
    await setup(undefined, 7);
    expect(component).toBeTruthy();

    fixture.detectChanges();

    const nameControl = component.getFormControl(CommonConstants.NAME);

    // form control exists
    expect(nameControl).toBeTruthy() ;

    // Create new pet profile form
    expect(component.petProfileForm.value).toBeTruthy();
  });


  // Receive pet data and create form with initial values
  it('should setup initial pet profile', async() => {
    await setup(PETS_TEST_DATA[0], 0);
  
    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.petProfileForm.value).toEqual(PET_INITIAL_TEST_DATA[0]);
  });


  // Listen for changes in 'factor' and update 'daily_calories'
  it('should change daily calories based on factor input', async () => {
    await setup(undefined, 5);

    fixture.detectChanges();

    const weightControl = component.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = component.getFormControl(CommonConstants.WEIGHT_UNIT);
    const factorControl = component.getFormControl(CommonConstants.FACTOR);

    weightControl.setValue(17.5);
    weightUnitControl.setValue('lb');
    factorControl.setValue(0.8)

    expect(component.petProfileForm.value['daily_calories']).toBe('264.8');
 
  });


    // Listen for changes in 'daily_calories' and update 'factor' 
    it('should change factor based on daily calories input', async () => {
      await setup(undefined, 5);
  
      fixture.detectChanges();
  
      const weightControl = component.getFormControl(CommonConstants.WEIGHT);
      const weightUnitControl = component.getFormControl(CommonConstants.WEIGHT_UNIT);
      const caloriesControl = component.getFormControl(CommonConstants.DAILY_CALORIES);
  
      weightControl.setValue(17.5);
      weightUnitControl.setValue('lb');
      caloriesControl.setValue(264.8)
  
      expect(component.petProfileForm.value['factor']).toBe('0.8');
   
    });


    // When the input changed, output the new data
    it('should update data after user change input', async () => {
      await setup(PETS_TEST_DATA[0], 0);
  
      fixture.detectChanges();
  
      const allergiesControl = component.getFormControl(CommonConstants.ALLERGIES);
  
      allergiesControl.setValue('fish');
  
      expect(component.petProfileForm.value['allergies']).toBe('fish');
    });

  

});
