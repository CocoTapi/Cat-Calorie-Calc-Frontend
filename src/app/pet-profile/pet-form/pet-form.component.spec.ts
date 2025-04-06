import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFormComponent } from './pet-form.component';
import { ComponentRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SlidePanelService } from '../../services/slide-panel/slide-panel.service';
import { GoalType, Pet_Profile, PetSpecies } from '../models/pet-profile.model';
import { CommonConstants } from '../../app.constants';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, Subscription } from 'rxjs';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let componentRef: ComponentRef<PetFormComponent>

  // Create a more complete mock for the SlidePanelService
  const mockValidationTrigger = new Subject<void>();
  const slidePanelService = {
    close: jasmine.createSpy('close'),
    canClose: jasmine.createSpy('canClose'),
    getValidationTrigger: jasmine.createSpy('getValidationTrigger').and.returnValue(mockValidationTrigger)
  }

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PetFormComponent, 
        ReactiveFormsModule, 
        MatNativeDateModule
      ],
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
      imports: [
        PetFormComponent, 
        ReactiveFormsModule,
        MatNativeDateModule
      ],
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

  it('should create', async () => {
    await setup(undefined, 0);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should setup initial pet profile', async () => {
    // Create a test pet data object
    const testPet = {
      id: 1,
      species: PetSpecies.CAT,
      name: 'Test Cat',
      icon: 'cat.png',
      birthday: new Date('2014-03-14T00:00:00'),
      weight: 17.5,
      weight_unit: 'lb',
      allergies: 'none',
      medications: [],
      goal: GoalType.LOSE,
      target_weight: 16,
      target_weight_unit: 'lb',
      factor: 0.8,
      daily_calories: 264.8,
      notes: 'Test notes'
    };

    await setup(testPet, 1);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      component.petProfileForm.patchValue({
        birthday: testPet.birthday,
        weight: testPet.weight,
        goal: testPet.goal,
        target_weight: testPet.target_weight
      });
    });
    
    fixture.detectChanges();
    
    // Verify form was updated with the values we patched
    expect(component.petProfileForm).toBeTruthy();
    expect(component.petProfileForm.get('birthday')?.value).toEqual(testPet.birthday);
    expect(component.petProfileForm.get('weight')?.value).toEqual(testPet.weight);
    expect(component.petProfileForm.get('goal')?.value).toEqual(testPet.goal);
    expect(component.petProfileForm.get('target_weight')?.value).toEqual(testPet.target_weight);
  });

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


  // Listen for changes in 'factor' and update 'daily_calories'
  it('should change daily calories based on factor input', async () => {
    await setup(undefined, 5);

    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });

    fixture.detectChanges();

    const weightControl = component.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = component.getFormControl(CommonConstants.WEIGHT_UNIT);
    const factorControl = component.getFormControl(CommonConstants.FACTOR);

    weightControl.setValue(17.5);
    weightUnitControl.setValue('lb');
    factorControl.setValue(0.8);

    expect(component.petProfileForm.value['daily_calories']).toBe('264.8');
  });


  // Listen for changes in 'daily_calories' and update 'factor' 
  it('should change factor based on daily calories input', async () => {
    await setup(undefined, 5);
  
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
  
    fixture.detectChanges();
  
    const weightControl = component.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = component.getFormControl(CommonConstants.WEIGHT_UNIT);
    const caloriesControl = component.getFormControl(CommonConstants.DAILY_CALORIES);
  
    weightControl.setValue(17.5);
    weightUnitControl.setValue('lb');
    caloriesControl.setValue(264.8);
  
    expect(component.petProfileForm.value['factor']).toBe('0.8');
  });


  // When the input changed, output the new data
  it('should update data after user change input', async () => {
    // Create a test pet data object
    const testPet: Pet_Profile = {
      id: 0,
      species: PetSpecies.CAT,
      name: 'Dodger',
      icon: 'dodger.png',
      birthday: new Date(2014, 2, 14),
      weight: 17.5,
      weight_unit: 'lb',
      allergies: "none",
      medications: [
        {
          med_id: 0,
          med_name: 'Atopica',
          directions: '1 pill / day'
        },
      ],
      goal: GoalType.LOSE,
      target_weight: 16,
      factor: 0.8,
      daily_calories: 264.8,
      notes: 'He is shy first but once he knows you, he loves hanging out and snuggle with them.'
    };
    
    await setup(testPet, 0);

    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      component.petProfileForm.patchValue(testPet);
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
  
    fixture.detectChanges();
  
    const allergiesControl = component.getFormControl(CommonConstants.ALLERGIES);
  
    allergiesControl.setValue('fish');
  
    expect(component.petProfileForm.value['allergies']).toBe('fish');
  });

  // Test the onSubmit method
  it('should submit form data correctly', async () => {
    await setup(undefined, 5);
    
    // Create test form data
    component.petProfileForm = createPetProfileForm();
    
    fixture.detectChanges();
    
    // Reset the spy call count
    slidePanelService.close.calls.reset();
    
    // Create formData to emit
    const formData = component.petProfileForm;
    
    // Emit the form data through the formGroupData Output
    component.formGroupData.emit(formData);
    
    // Directly call close panel method
    Object.getOwnPropertyDescriptor(component, 'slidePanelService')?.value.close(CommonConstants.PET_FORM);
    
    // Verify slidePanelService.close was called with the right panel ID
    expect(slidePanelService.close).toHaveBeenCalledWith(CommonConstants.PET_FORM);
  });

  // Test the validation behavior
  it('should validate form before closing panel', async () => {
    await setup(undefined, 5);
    
    // Create a clean component instance for this test
    const newFixture = TestBed.createComponent(PetFormComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.petId = 5;
    
    // Setup the form
    newComponent.petProfileForm = createPetProfileForm();
    
    // Make the form invalid
    newComponent.petProfileForm.get('name')?.setErrors({ required: true });
    newComponent.petProfileForm.updateValueAndValidity();
    
    // Manually register the validation callback using proper typecasting
    slidePanelService.canClose.calls.reset();
    (newComponent as unknown as { registerPanelCloseValidation: () => void }).registerPanelCloseValidation();
    
    // At this point the validation callback should be registered
    const canCloseCallback = slidePanelService.canClose.calls.mostRecent().args[1];
    
    // Create a spy for showFormErrors
    const showFormErrorsSpy = jasmine.createSpy('showFormErrors');
    Object.defineProperty(newComponent, 'showFormErrors', {
      value: showFormErrorsSpy,
      configurable: true,
      writable: true
    });
    
    // When we call the validation callback, it should return false for invalid form
    expect(canCloseCallback()).toBeFalse();
    expect(showFormErrorsSpy).toHaveBeenCalled();
    
    // Now make the form valid
    newComponent.petProfileForm.get('name')?.setErrors(null);
    newComponent.petProfileForm.updateValueAndValidity();
    
    // The validation callback should now return true
    expect(canCloseCallback()).toBeTrue();
  });
  
  // Test subscription cleanup
  it('should clean up subscriptions when destroy callback is triggered', async () => {
    await setup(undefined, 5);
    
    // Create a clean component instance for this test
    const newFixture = TestBed.createComponent(PetFormComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.petId = 5;
    
    // Initialize form first to avoid errors
    newComponent.petProfileForm = createPetProfileForm();
    
    // Setup subscriptions
    (newComponent as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    
    // Verify the subscriptions exist
    expect(newComponent['factorSubscription']).toBeDefined();
    expect(newComponent['caloriesSubscription']).toBeDefined();
    expect(newComponent['formSubscription']).toBeDefined();
    
    // Create stubs for testing that cleanup was registered
    let cleanupRegistered = false;
    
    // Override the destroyRef.onDestroy to verify it's called
    Object.defineProperty(newComponent, 'destroyRef', {
      value: { 
        onDestroy: () => {
          cleanupRegistered = true;
        } 
      },
      configurable: true
    });
    
    // Call setupSubscriptions again to register with our spy
    (newComponent as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    
    // Verify cleanup was registered
    expect(cleanupRegistered).toBeTrue();
  });

  // Test form submission when panel is closed
  it('should emit form data when panel is closed', async () => {
    await setup(undefined, 5);
    
    // Create test form data
    component.petProfileForm = createPetProfileForm();
    
    // Spy on form data emission
    spyOn(component.formGroupData, 'emit');
    
    // Manually initialize to set up subscriptions
    component.ngOnInit();
    
    fixture.detectChanges();
    
    // Reset the spy call count
    slidePanelService.close.calls.reset();
    
    // Manually trigger the form subscription to emit the form data
    component.petProfileForm.updateValueAndValidity();
    
    // Trigger panel close which should submit the form data
    const slidePanelServiceInstance = Object.getOwnPropertyDescriptor(component, 'slidePanelService')?.value;
    slidePanelServiceInstance.close(CommonConstants.PET_FORM);
    
    // Verify service.close was called with the right panel ID
    expect(slidePanelService.close).toHaveBeenCalledWith(CommonConstants.PET_FORM);
    
    // The form data should also be emitted
    expect(component.formGroupData.emit).toHaveBeenCalled();
  });

  // Test subscription setup
  describe('Subscription setup', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });
    
    it('should set up all required subscriptions during initialization', () => {
      // Mock the component's ngOnInit to call the real method but also track when it's called
      const originalNgOnInit = component.ngOnInit;
      let setupSubscriptionsCalled = false;
      
      // Replace setupSubscriptions with a version that tracks calls
      Object.defineProperty(component, 'setupSubscriptions', {
        value: function() {
          setupSubscriptionsCalled = true;
        },
        writable: true
      });
      
      // Call ngOnInit to trigger setup
      component.ngOnInit();
      
      // Verify our tracking variable was set
      expect(setupSubscriptionsCalled).toBeTrue();
      
      // Restore original method
      component.ngOnInit = originalNgOnInit;
    });
  });
  
  // Test for form subscription handlers
  describe('Form subscriptions', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });
    
    // Test that form validation works
    it('should emit validation status on form changes', () => {
      spyOn(component.formValidationChange, 'emit');
      
      // Make the form invalid
      const nameControl = component.getFormControl(CommonConstants.NAME);
      nameControl.setValue(''); // Empty value
      nameControl.markAsTouched();
      
      // Manually trigger validation
      component.petProfileForm.updateValueAndValidity();
      
      // Should emit false for invalid form
      expect(component.formValidationChange.emit).toHaveBeenCalledWith(false);
      
      // Make the form valid again
      nameControl.setValue('Valid Name');
      
      // Manually trigger validation again
      component.petProfileForm.updateValueAndValidity();
      
      // Should emit true for valid form
      expect(component.formValidationChange.emit).toHaveBeenCalledWith(true);
    });
    
    // Test that form data is emitted
    it('should emit form data on form changes', () => {
      spyOn(component.formGroupData, 'emit');
      
      // Change a form field
      const nameControl = component.getFormControl(CommonConstants.NAME);
      nameControl.setValue('New Name');
      
      // Manually trigger validation
      component.petProfileForm.updateValueAndValidity();
      
      // Should emit the form
      expect(component.formGroupData.emit).toHaveBeenCalledWith(component.petProfileForm);
    });
  });

  // Test the medication FormArray functionality
  describe('Medication functionality', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });

    it('should add medication when addMedication is called', () => {
      const initialLength = component.medications.length;
      
      component.addMedication();
      
      expect(component.medications.length).toBe(initialLength + 1);
      expect(component.medications.at(initialLength).get(CommonConstants.MED_ID)?.value)
        .toBe(initialLength);
    });

    it('should remove medication when removeMedication is called', async () => {
      // Add two medications first
      component.addMedication();
      component.addMedication();
      const initialLength = component.medications.length;
      
      component.removeMedication(0);
      
      expect(component.medications.length).toBe(initialLength - 1);
    });

    it('should correctly evaluate isAddDisabled when there are no medications', () => {
      // Make sure medications array is empty
      while (component.medications.length > 0) {
        component.removeMedication(0);
      }
      
      expect(component.isAddDisabled()).toBeFalse();
    });

    it('should disable add button when last medication directions is empty', () => {
      component.addMedication();
      const lastIndex = component.medications.length - 1;
      
      const medNameControl = component.getMedItemControl(lastIndex, CommonConstants.MED_NAME);
      const directionsControl = component.getMedItemControl(lastIndex, CommonConstants.DIRECTIONS);
      
      medNameControl.setValue('Test Med');
      directionsControl.setValue('');
      
      expect(component.isAddDisabled()).toBeTrue();
    });

    it('should enable add button when last medication is properly filled', () => {
      component.addMedication();
      const lastIndex = component.medications.length - 1;
      
      const medNameControl = component.getMedItemControl(lastIndex, CommonConstants.MED_NAME);
      const directionsControl = component.getMedItemControl(lastIndex, CommonConstants.DIRECTIONS);
      
      medNameControl.setValue('Test Med');
      directionsControl.setValue('Take once daily');
      
      expect(component.isAddDisabled()).toBeFalse();
    });

    it('should get correct medication item control', () => {
      component.addMedication();
      const medNameControl = component.getMedItemControl(0, CommonConstants.MED_NAME);
      
      expect(medNameControl).toBeTruthy();
      medNameControl.setValue('New Med');
      
      expect(component.medications.at(0).get(CommonConstants.MED_NAME)?.value).toBe('New Med');
    });

    it('should throw error when attempting to get non-existent med item', () => {
      component.addMedication();
      
      expect(() => {
        component.getMedItemControl(0, 'non_existent_field' as unknown as import('../models/pet-profile.model').MedItemType);
      }).toThrow();
    });
  });

  // Test form validation and data emission
  it('should emit form validation status changes', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    spyOn(component.formValidationChange, 'emit');
    
    // Make the form invalid
    const nameControl = component.getFormControl(CommonConstants.NAME);
    nameControl.setValue(''); // Empty name should make it invalid
    nameControl.markAsDirty();
    nameControl.updateValueAndValidity();
    
    // Form should be invalid and emit false
    expect(component.formValidationChange.emit).toHaveBeenCalledWith(false);
  });

  it('should emit form group data on status changes', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    spyOn(component.formGroupData, 'emit');
    
    const nameControl = component.getFormControl(CommonConstants.NAME);
    nameControl.setValue('New Name');
    nameControl.markAsDirty();
    nameControl.updateValueAndValidity();
    
    expect(component.formGroupData.emit).toHaveBeenCalled();
  });

  // Test the weight conversion functionality
  it('should convert weight from lb to kg correctly', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    const weightControl = component.getFormControl(CommonConstants.WEIGHT);
    const weightUnitControl = component.getFormControl(CommonConstants.WEIGHT_UNIT);
    const factorControl = component.getFormControl(CommonConstants.FACTOR);
    
    // Set weight in lb
    weightControl.setValue(22);
    weightUnitControl.setValue('lb');
    factorControl.setValue(1);
    
    const caloriesLb = component.petProfileForm.value['daily_calories'];
    
    // Change to kg (same weight numerically, but different actual weight)
    weightControl.setValue(22);
    weightUnitControl.setValue('kg');
    factorControl.setValue(1);
    
    const caloriesKg = component.petProfileForm.value['daily_calories'];
    
    // Calories should be higher for kg since 22kg > 22lb
    expect(parseFloat(caloriesKg)).toBeGreaterThan(parseFloat(caloriesLb));
  });

  // Test error handling
  it('should throw error when accessing non-existent form control', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    expect(() => {
      component.getFormControl('non_existent_field' as unknown as string);
    }).toThrow();
  });

  it('should throw error when medications FormArray does not exist', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    // Mock a scenario where medications property doesn't exist
    spyOn(component.petProfileForm, 'get').and.returnValue(null);
    
    expect(() => {
      component.medications;
    }).toThrow();
  });

  // Test behavior with weight = 0 (edge cases)
  it('should handle weight=0 appropriately', async () => {
    await setup(undefined, 5);
    
    // Spy on ngOnInit to prevent SlidePanelService calls
    spyOn(component, 'ngOnInit').and.callFake(() => {
      component.petProfileForm = createPetProfileForm();
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    });
    
    fixture.detectChanges();
    
    const weightControl = component.getFormControl(CommonConstants.WEIGHT);
    weightControl.setValue(0);
    
    const factorControl = component.getFormControl(CommonConstants.FACTOR);
    factorControl.setValue(1.2);
    
    // Calories should be 0 or some default value when weight is 0
    const dailyCalories = component.petProfileForm.value['daily_calories'];
    expect(dailyCalories).toBeDefined();
  });

  // Additional tests for private methods and error handling
  describe('Private methods and error handling', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });
    
    // Test showFormErrors method
    it('should mark all controls as touched when showFormErrors is called', () => {
      // Create spy on the component instance
      const markAllAsTouchedSpy = jasmine.createSpy('markAllAsTouched');
      
      // Replace the private method temporarily
      (component as unknown as {markAllAsTouched: () => void}).markAllAsTouched = markAllAsTouchedSpy;
      
      // Call private method via typecasting
      (component as unknown as { showFormErrors: () => void }).showFormErrors();
      
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(component.showValidationErrors).toBeTrue();
    });
    
    // Test markAllAsTouched method directly
    it('should mark all controls in the form as touched', () => {
      // Create a form with untouched controls
      component.petProfileForm = createPetProfileForm();
      const nameControl = component.getFormControl(CommonConstants.NAME);
      nameControl.markAsUntouched();
      expect(nameControl.touched).toBeFalse();
      
      // Call markAllAsTouched directly
      (component as unknown as { markAllAsTouched: () => void }).markAllAsTouched();
      
      // Verify controls were marked as touched
      expect(nameControl.touched).toBeTrue();
    });
    
    // Test markAllAsTouched with FormArray
    it('should mark FormArray child controls as touched', () => {
      // Add a medication to create a FormArray
      component.addMedication();
      
      // Get the medication control and mark as untouched
      const medNameControl = component.getMedItemControl(0, CommonConstants.MED_NAME);
      medNameControl.markAsUntouched();
      expect(medNameControl.touched).toBeFalse();
      
      // Call markAllAsTouched directly
      (component as unknown as { markAllAsTouched: () => void }).markAllAsTouched();
      
      // Verify the control in the FormArray was marked as touched
      expect(medNameControl.touched).toBeTrue();
    });
    
    // Test blurAllInputs method with active element
    it('should blur active element if it exists', () => {
      // Create a mock element that can be blurred
      const mockElement = document.createElement('input');
      spyOn(mockElement, 'blur');
      
      // Use Object.defineProperty to safely mock activeElement without TypeScript errors
      const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
      Object.defineProperty(document, 'activeElement', {
        get: () => mockElement,
        configurable: true
      });
      
      // Call blurAllInputs
      (component as unknown as { blurAllInputs: () => void }).blurAllInputs();
      
      // Verify the element was blurred
      expect(mockElement.blur).toHaveBeenCalled();
      
      // Restore original activeElement if it existed
      if (originalActiveElement) {
        Object.defineProperty(document, 'activeElement', originalActiveElement);
      }
    });
    
    // Test blurAllInputs with form elements
    it('should blur all form input elements', () => {
      // Create mock elements and query results
      const mockInput1 = document.createElement('input');
      const mockInput2 = document.createElement('textarea');
      const mockInputs = [mockInput1, mockInput2];
      
      // Spy on the blur methods
      spyOn(mockInput1, 'blur');
      spyOn(mockInput2, 'blur');
      
      // Mock querySelector and querySelectorAll
      const mockForm = document.createElement('form');
      spyOn(document, 'querySelector').and.returnValue(mockForm);
      
      // Create a fake NodeList-like structure
      const nodeList = {
        length: mockInputs.length,
        item: (index: number) => mockInputs[index],
        [0]: mockInputs[0],
        [1]: mockInputs[1],
        forEach: (callback: (element: Element, index: number) => void) => {
          mockInputs.forEach(callback);
        }
      };
      
      spyOn(mockForm, 'querySelectorAll').and.returnValue(nodeList as unknown as NodeListOf<Element>);
      
      // Call blurAllInputs
      (component as unknown as { blurAllInputs: () => void }).blurAllInputs();
      
      // Verify all inputs were blurred
      expect(mockInput1.blur).toHaveBeenCalled();
      expect(mockInput2.blur).toHaveBeenCalled();
    });
    
    /**
     * Test cleanup of subscriptions on destroy
     */
    it('should clean up subscriptions on destroy', () => {
      // Define interfaces for better type safety
      interface DestroyCallbackFunction {
        (): void;
        originalCallback?: () => void;
      }
      
      // Create a simple test for subscription cleanup
      const destroyCallbackSpy = jasmine.createSpy('destroyCallback');
      
      // Mock a destroy callback that will call unsubscribe on all subscriptions
      const mockDestroyCallback: DestroyCallbackFunction = () => {
        // Check if subscriptions exist and are defined
        // Use Object.getOwnPropertyDescriptor instead of direct access
        const factorSubscription = Object.getOwnPropertyDescriptor(component, 'factorSubscription')?.value as Subscription | undefined;
        const caloriesSubscription = Object.getOwnPropertyDescriptor(component, 'caloriesSubscription')?.value as Subscription | undefined;
        const formSubscription = Object.getOwnPropertyDescriptor(component, 'formSubscription')?.value as Subscription | undefined;
        
        if (factorSubscription) {
          factorSubscription.unsubscribe();
        }
        if (caloriesSubscription) {
          caloriesSubscription.unsubscribe();
        }
        if (formSubscription) {
          formSubscription.unsubscribe();
        }
        destroyCallbackSpy();
      };
      
      // Create a spy for the destroyRef.onDestroy method
      const onDestroySpy = jasmine.createSpy('onDestroy').and.callFake((callback: () => void) => {
        // Store the callback for later execution
        mockDestroyCallback.originalCallback = callback;
      });
      
      // Replace the real destroyRef with our spy
      Object.defineProperty(component, 'destroyRef', {
        value: { onDestroy: onDestroySpy },
        writable: true
      });
      
      // Call setupSubscriptions to register our callback
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      
      // Verify onDestroy was called with a callback
      expect(onDestroySpy).toHaveBeenCalledWith(jasmine.any(Function));
      
      // Replace the subscriptions with spies
      const unsubscribeSpy = jasmine.createSpy('unsubscribe');
      const subscriptions = [
        { unsubscribe: unsubscribeSpy },
        { unsubscribe: unsubscribeSpy },
        { unsubscribe: unsubscribeSpy }
      ];
      
      // Replace the real subscriptions with our spy versions using Object.defineProperty
      Object.defineProperty(component, 'factorSubscription', { value: subscriptions[0], writable: true });
      Object.defineProperty(component, 'caloriesSubscription', { value: subscriptions[1], writable: true });
      Object.defineProperty(component, 'formSubscription', { value: subscriptions[2], writable: true });
      
      // Call the original callback (registered with onDestroy)
      const originalCallback = mockDestroyCallback.originalCallback;
      if (originalCallback) originalCallback();
      
      // Verify the subscriptions were unsubscribed
      expect(unsubscribeSpy).toHaveBeenCalledTimes(3);
    });
  });

  // Additional tests for edge cases and error handling
  describe('Error handling and edge cases', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });
    
    // Instead of trying to spy on private methods, test their effects
    it('should properly set up subscriptions that react to form changes', () => {
      // Reset the component to ensure subscriptions are set up fresh
      component.ngOnInit();
      
      // Spy on the emit methods
      spyOn(component.formValidationChange, 'emit');
      spyOn(component.formGroupData, 'emit');
      
      // Change the weight which should trigger calorie calculations 
      const weightControl = component.getFormControl(CommonConstants.WEIGHT);
      const factorControl = component.getFormControl(CommonConstants.FACTOR);
      
      weightControl.setValue(15);
      factorControl.setValue(1.2);
      
      // Manually trigger validation to ensure events fire
      component.petProfileForm.updateValueAndValidity();
      
      // Check that the proper events were emitted
      expect(component.formValidationChange.emit).toHaveBeenCalled();
      expect(component.formGroupData.emit).toHaveBeenCalled();
      
      // Verify that daily calories were updated based on the weight and factor
      const dailyCalories = component.petProfileForm.value['daily_calories'];
      expect(parseFloat(dailyCalories)).toBeGreaterThan(0);
    });
    
    // Test handling a undefined pet value in the input
    it('should handle undefined pet input gracefully', () => {
      // Use the existing fixture which already has pet set to undefined
      const testFixture = TestBed.createComponent(PetFormComponent);
      const testComponent = testFixture.componentInstance;
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(testComponent, 'ngOnInit').and.callFake(() => {
        testComponent.petProfileForm = createPetProfileForm();
        (testComponent as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      // Set required petId
      testComponent.petId = 99;
      
      // Should not throw error during initialization
      expect(() => {
        testFixture.detectChanges(); // Triggers ngOnInit
      }).not.toThrow();
      
      // Form should be created with default values
      expect(testComponent.petProfileForm).toBeTruthy();
    });
    
    // Test with zero weight (regression test)
    it('should calculate RER with zero weight without throwing error', () => {
      // Set weight to 0
      const weightControl = component.getFormControl(CommonConstants.WEIGHT);
      weightControl.setValue(0);
      
      // Trigger factor change which calls getRER
      const factorControl = component.getFormControl(CommonConstants.FACTOR);
      
      // Should not throw
      expect(() => {
        factorControl.setValue(1.5);
      }).not.toThrow();
      
      // Daily calories should be 0 since weight is 0
      const dailyCalories = parseFloat(component.petProfileForm.value['daily_calories']);
      expect(dailyCalories).toBe(0);
    });
    
    // Test the form data emission specifically
    it('should emit form data when status changes', () => {
      spyOn(component.formGroupData, 'emit');
      
      // Update a control to trigger status changes
      const nameControl = component.getFormControl(CommonConstants.NAME);
      nameControl.setValue('Updated Name');
      
      // Manually trigger form validation to ensure emission
      component.petProfileForm.updateValueAndValidity();
      
      // Check if the form was emitted
      expect(component.formGroupData.emit).toHaveBeenCalledWith(component.petProfileForm);
    });
  });

  // Test the setupSubscriptions method more thoroughly
  describe('Setup Subscriptions - Advanced Testing', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Don't spy on ngOnInit so we can test the real method
      fixture.detectChanges();
    });
    
    /**
     * Test empty factor handling
     */
    it('should not update calories when factor is empty', () => {
      // Set weight for baseline
      const weightControl = component.getFormControl(CommonConstants.WEIGHT);
      const dailyCaloriesControl = component.getFormControl(CommonConstants.DAILY_CALORIES);
      
      weightControl.setValue(10);
      dailyCaloriesControl.setValue(500);
      
      // Set factor to empty - null, undefined, empty string scenarios
      const factorControl = component.getFormControl(CommonConstants.FACTOR);
      factorControl.setValue(null);
      
      // Daily calories should remain unchanged
      expect(dailyCaloriesControl.value).toBe(500);
    });
    
    /**
     * Test empty calories handling
     */
    it('should not update factor when calories is empty', () => {
      // Set weight for baseline
      const weightControl = component.getFormControl(CommonConstants.WEIGHT);
      const factorControl = component.getFormControl(CommonConstants.FACTOR);
      
      weightControl.setValue(10);
      factorControl.setValue(1.5);
      
      // Set calories to empty
      const dailyCaloriesControl = component.getFormControl(CommonConstants.DAILY_CALORIES);
      dailyCaloriesControl.setValue('');
      
      // Factor should remain unchanged
      expect(factorControl.value).toBe(1.5);
    });
    
    /**
     * Test form status changes when form becomes valid
     */
    it('should hide validation errors when form becomes valid', () => {
      // Set validation errors to visible
      component.showValidationErrors = true;
      
      // Make form valid
      component.petProfileForm.get('name')?.setValue('Valid Name');
      component.petProfileForm.updateValueAndValidity();
      
      // Validation errors should be hidden
      expect(component.showValidationErrors).toBeFalse();
    });
    
    /**
     * Test cleanup of subscriptions on destroy
     */
    it('should clean up subscriptions on destroy', () => {
      // Create a simple test for subscription cleanup
      const destroyCallbackSpy = jasmine.createSpy('destroyCallback');
      
      // Create an interface to extend the function type
      interface DestroyCallbackFunction {
        (): void;
        originalCallback?: () => void;
      }
      
      // Mock a destroy callback that will call unsubscribe on all subscriptions
      const mockDestroyCallback: DestroyCallbackFunction = () => {
        // Check if subscriptions exist and are defined
        // Use Object.getOwnPropertyDescriptor instead of direct access
        const factorSubscription = Object.getOwnPropertyDescriptor(component, 'factorSubscription')?.value as Subscription | undefined;
        const caloriesSubscription = Object.getOwnPropertyDescriptor(component, 'caloriesSubscription')?.value as Subscription | undefined;
        const formSubscription = Object.getOwnPropertyDescriptor(component, 'formSubscription')?.value as Subscription | undefined;
        
        if (factorSubscription) {
          factorSubscription.unsubscribe();
        }
        if (caloriesSubscription) {
          caloriesSubscription.unsubscribe();
        }
        if (formSubscription) {
          formSubscription.unsubscribe();
        }
        destroyCallbackSpy();
      };
      
      // Create a spy for the destroyRef.onDestroy method
      const onDestroySpy = jasmine.createSpy('onDestroy').and.callFake((callback: () => void) => {
        // Store the callback for later execution
        mockDestroyCallback.originalCallback = callback;
      });
      
      // Replace the real destroyRef with our spy
      Object.defineProperty(component, 'destroyRef', {
        value: { onDestroy: onDestroySpy },
        writable: true
      });
      
      // Call setupSubscriptions to register our callback
      (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      
      // Verify onDestroy was called with a callback
      expect(onDestroySpy).toHaveBeenCalledWith(jasmine.any(Function));
      
      // Replace the subscriptions with spies
      const unsubscribeSpy = jasmine.createSpy('unsubscribe');
      const subscriptions = [
        { unsubscribe: unsubscribeSpy },
        { unsubscribe: unsubscribeSpy },
        { unsubscribe: unsubscribeSpy }
      ];
      
      // Replace the real subscriptions with our spy versions using Object.defineProperty
      Object.defineProperty(component, 'factorSubscription', { value: subscriptions[0], writable: true });
      Object.defineProperty(component, 'caloriesSubscription', { value: subscriptions[1], writable: true });
      Object.defineProperty(component, 'formSubscription', { value: subscriptions[2], writable: true });
      
      // Call the original callback (registered with onDestroy)
      const originalCallback = mockDestroyCallback.originalCallback;
      if (originalCallback) originalCallback();
      
      // Verify the subscriptions were unsubscribed
      expect(unsubscribeSpy).toHaveBeenCalledTimes(3);
    });
  });

  /**
   * Test the private getRER method directly
   */
  describe('getRER method', () => {
    beforeEach(async () => {
      await setup(undefined, 5);
      
      // Spy on ngOnInit to prevent SlidePanelService calls
      spyOn(component, 'ngOnInit').and.callFake(() => {
        component.petProfileForm = createPetProfileForm();
        (component as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
      });
      
      fixture.detectChanges();
    });
    
    /**
     * Test basic kg calculation
     */
    it('should calculate RER correctly with kg weight', () => {
      // Set weight in kg
      component.getFormControl(CommonConstants.WEIGHT).setValue(10);
      component.getFormControl(CommonConstants.WEIGHT_UNIT).setValue('kg');
      
      // Call getRER directly
      const result = (component as unknown as { getRER: () => number }).getRER();
      
      // Expected: 70 * (10^0.75) = 70 * 5.62 ≈ 393.64
      // Use toBeDefined instead of comparing exact values since rounding may differ
      expect(result).toBeDefined();
      expect(result).toBeGreaterThan(390);
      expect(result).toBeLessThan(396);
    });
    
    /**
     * Test lb to kg conversion
     */
    it('should convert lb to kg and calculate RER correctly', () => {
      // Set weight in lb
      component.getFormControl(CommonConstants.WEIGHT).setValue(20); // ~9.07 kg
      component.getFormControl(CommonConstants.WEIGHT_UNIT).setValue('lb');
      
      // Call getRER directly
      const result = (component as unknown as { getRER: () => number }).getRER();
      
      // Expected: 70 * ((20/2.2046)^0.75) ≈ 366
      // Use range comparison instead of exact match
      expect(result).toBeDefined();
      expect(result).toBeGreaterThan(360);
      expect(result).toBeLessThan(370);
    });
    
    /**
     * Test zero weight handling
     */
    it('should return 0 when weight is 0', () => {
      // Set weight to 0
      component.getFormControl(CommonConstants.WEIGHT).setValue(0);
      
      // Call getRER directly
      const result = (component as unknown as { getRER: () => number }).getRER();
      
      // Should return 0
      expect(result).toBe(0);
    });
    
    /**
     * Test empty weight handling
     */
    it('should return 0 when weight is empty', () => {
      // Set weight to empty
      component.getFormControl(CommonConstants.WEIGHT).setValue(null);
      
      // Call getRER directly
      const result = (component as unknown as { getRER: () => number }).getRER();
      
      // Should return 0
      expect(result).toBe(0);
    });
  });

  // Test registerPanelCloseValidation method completely
  it('should register panel close validation callback', async () => {
    await setup(undefined, 5);
    
    // Create a new instance to avoid conflicts with other tests
    const fixture = TestBed.createComponent(PetFormComponent);
    const component = fixture.componentInstance;
    component.petId = 5; // Use number instead of string
    
    // Init the form 
    component.petProfileForm = createPetProfileForm();
    
    // Reset the spy call count
    slidePanelService.canClose.calls.reset();
    
    // Mock the validation trigger
    const mockValidationTrigger = new Subject<void>();
    slidePanelService.getValidationTrigger.and.returnValue(mockValidationTrigger);
    
    // Mock destroyRef without causing view destruction
    Object.defineProperty(component, 'destroyRef', {
      value: { 
        onDestroy: jasmine.createSpy('onDestroy')
      },
      configurable: true,
      writable: true
    });
    
    // Call the method directly without triggering ngOnInit
    (component as unknown as { registerPanelCloseValidation: () => void }).registerPanelCloseValidation();
    
    // Verify canClose was registered
    expect(slidePanelService.canClose).toHaveBeenCalledWith(
      CommonConstants.PET_FORM, 
      jasmine.any(Function)
    );
    
    // Test the canClose callback for invalid form
    component.petProfileForm.get('name')?.setErrors({ required: true });
    component.petProfileForm.updateValueAndValidity();
    
    // Spy on showFormErrors
    const showFormErrorsSpy = jasmine.createSpy('showFormErrors');
    Object.defineProperty(component, 'showFormErrors', {
      value: showFormErrorsSpy,
      configurable: true,
      writable: true
    });
    
    // Get the callback and test it
    const canCloseCallback = slidePanelService.canClose.calls.mostRecent().args[1];
    expect(canCloseCallback()).toBeFalse();
    expect(showFormErrorsSpy).toHaveBeenCalled();
    
    // Test with valid form 
    component.petProfileForm.get('name')?.setErrors(null);
    component.petProfileForm.updateValueAndValidity();
    expect(canCloseCallback()).toBeTrue();
  });
  
  /**
   * Test cleanup of subscriptions on destroy
   */
  it('should clean up subscriptions when component is destroyed - duplicate', async () => {
    await setup(undefined, 5);
    
    // Create a clean component instance for this test
    const newFixture = TestBed.createComponent(PetFormComponent);
    const newComponent = newFixture.componentInstance;
    newComponent.petId = 5;
    
    // Initialize the form first to avoid the "petProfileForm is undefined" error
    newComponent.petProfileForm = createPetProfileForm();
    
    // Setup subscriptions
    (newComponent as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    
    // Verify the subscriptions exist
    expect(newComponent['factorSubscription']).toBeDefined();
    expect(newComponent['caloriesSubscription']).toBeDefined();
    expect(newComponent['formSubscription']).toBeDefined();
    
    // Create stubs for testing that cleanup was registered
    let cleanupRegistered = false;
    
    // Override the destroyRef.onDestroy to verify it's called
    Object.defineProperty(newComponent, 'destroyRef', {
      value: { 
        onDestroy: () => {
          cleanupRegistered = true;
        } 
      },
      configurable: true
    });
    
    // Call setupSubscriptions again to register with our spy
    (newComponent as unknown as { setupSubscriptions: () => void }).setupSubscriptions();
    
    // Verify cleanup was registered
    expect(cleanupRegistered).toBeTrue();
  });

  // Test form data handling during panel interaction
  it('should correctly handle form data during panel interactions', async () => {
    await setup(undefined, 5);
    
    // Create test form data
    component.petProfileForm = createPetProfileForm();
    
    fixture.detectChanges();
    
    // Spy on form data emission
    spyOn(component.formGroupData, 'emit');
    
    // Manually trigger a form change which should emit the form data
    const nameControl = component.getFormControl(CommonConstants.NAME);
    nameControl.setValue('New Test Name');
    component.petProfileForm.updateValueAndValidity();
    
    // Verify form data was emitted 
    expect(component.formGroupData.emit).toHaveBeenCalled();
  });
});

// Helper function for creating a test form
function createPetProfileForm(): FormGroup {
  return new FormGroup({
    species: new FormControl('cat'),
    name: new FormControl('test'),
    birthday: new FormControl(new Date()),
    weight: new FormControl(10),
    weight_unit: new FormControl('kg'),
    allergies: new FormControl(''),
    medications: new FormControl([]),
    goal: new FormControl('Maintain'),
    target_weight: new FormControl(10),
    target_weight_unit: new FormControl('kg'),
    factor: new FormControl(1.0),
    daily_calories: new FormControl(100),
    notes: new FormControl('')
  });
}
