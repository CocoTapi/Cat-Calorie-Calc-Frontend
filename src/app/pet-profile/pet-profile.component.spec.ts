import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PetProfileComponent } from './pet-profile.component';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { of } from 'rxjs';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { CommonConstants } from '../app.constants';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { Pet_Profile } from './models/pet-profile.model';
// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { By } from '@angular/platform-browser';

// @Component({
//   selector: 'app-pet-form',
//   template: ''
// })
// class MockPetFormComponent {
//   @Output() formValidityChange = new EventEmitter<boolean>();
//   @Output() formGroupChange = new EventEmitter<FormGroup>();
// }


describe('PetProfileComponent', () => {
  let component: PetProfileComponent;
  let fixture: ComponentFixture<PetProfileComponent>;

  // Shared mock service with a spy that we override per test
  const petProfileService = {
    getPetByPetId: jasmine.createSpy('getPetByPetId')
  };

  const slidePanelService = jasmine.createSpyObj('SlidePanelService', ['canClose', 'open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetProfileComponent],
      providers: [
        { provide: PetProfileService, useValue: petProfileService },
      ]
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(PetProfileComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  }

  function updateCheck() {
    tick(); // flush observable
    fixture.detectChanges();
  }

  it ('should create the component', () => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    createComponent();

    expect(component).toBeTruthy();
  });

  // ------ pet data fetch and set ------

  // Fetch pet data and set _pet
  it('should set _pet signal when pet data is returned', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    createComponent();
    updateCheck();

    // Access signal directly
    expect(component['_pet']()).toBe(PETS_TEST_DATA[0]); 
  }));


  // Fetch data and set pet() 
  it('should pet data and update pet()', () => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    createComponent();

    expect(component.pet()).toBe(PETS_TEST_DATA[0]); 
  });

    
  // Data fetch failed and keep pet() undefined.
  it('should get undefined data and keep it undefined', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile));
    
    updateCheck();

    expect(() => component.pet()).toBeUndefined;
  }))


  // ------ ngAfterViewInit ------
  it('should register canClose callback with slidePanelService on ngAfterViewInit', () => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    // Configure TestBed with just this mock
    TestBed.configureTestingModule({
      imports: [PetProfileComponent],
      providers: [
        { provide: SlidePanelService, useValue: slidePanelService },
        { provide: PetProfileService, useValue: petProfileService }
      ]
    }).compileComponents();

    // Re-Create the component
    const fixture = TestBed.createComponent(PetProfileComponent);
    const component = fixture.componentInstance;

    
    component.panelId =  CommonConstants.PET_FORM;
    
    // mock canPanelClose to return false
    spyOn(component, 'canPanelClose').and.returnValue(false);
  
    // Trigger the registration logic
    component.ngAfterViewInit();
  
    // Get the callback function that was registered with the service
    const registeredCallback = (
      slidePanelService.canClose as jasmine.Spy).calls.mostRecent().args[1];
  
    // Simulate the panel trying to close 
    const result = registeredCallback();

    // Expect panel won't close
    expect(result).toBeFalse();
  });

    
  
  
  // ------ For pet profile ------

  // imagePath Check from data 
  it ('should compute image path after observable emits', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));
    
    createComponent();
    updateCheck();

    expect(component.imagePath()).toBe('pets/dodger.png');
  }));

  // Fetch pet data but no img url are registered
  it ('should display default image path', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0];
    mockData.icon = '';
    petProfileService.getPetByPetId.and.returnValue(of(mockData));

    createComponent();
    updateCheck();

    tick(); 
    expect(component.imagePath()).toBe('pets/paw.png');
  }));

  // Get age data successfully
  it ('should get birthday and calculate age', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    createComponent();

    updateCheck();

    expect(component.age()).toBe(11);
  }));

   // Get graph title successfully 
   it ('should display goal with target weight', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    createComponent();
    tick(); // resolve observable

    expect(component.graphTitle()).toBe("Goal: Lose Weight to 16 lb");
  }));

   // When user's goal = maintain
   it ('should display only title (goal = maintain)', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0];
    mockData.goal = 'Maintain';

    petProfileService.getPetByPetId.and.returnValue(of(mockData));

    createComponent();
    tick(); // resolve observable

    expect(component.graphTitle()).toBe("Goal: Maintain Weight");
  }));

  
   // When user's target weight are same as current weight 
   it ('should display only title:(target weight = current weight)', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0];
    mockData.goal = 'Maintain';
    mockData.target_weight = 17.5;

    petProfileService.getPetByPetId.and.returnValue(of(mockData));

    createComponent();
    tick(); // resolve observable

    expect(component.graphTitle()).toBe("Goal: Maintain Weight");
  }));

});

 // // Data fetch failed and display default title
  // it('should display only goal without target weight', fakeAsync(() => {
  //   petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
  //   createComponent();
  //   updateCheck();

  //   // fallback/default
  //   expect(component.graphTitle()).toBe("Goal: Maintain Weight"); 
  // }));


 //   // ----- edit form -----

  // // Receive child data and set validation
  // it('should update formValid when child emits formValidityChange', () => {
  //   petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

  //   createComponent();
  //   tick(); // resolve observable

  //   // mock an edit form component
  //   const mockChild = fixture.debugElement.query(
  //     By.directive(MockPetFormComponent)).componentInstance;

  //   // send validation true from form component
  //   mockChild.formValidityChange.emit(true);

  //   expect(component.formValid).toBeTrue();
  // });















//   // Receive child data and set petFormGroup
//   it('should update petFormGroup when child emits formGroupChange', () => {
//     const mockForm = new FormGroup({
//       name: new FormControl('Dodger'),
//       age: new FormControl(11)
//     });

//     const mockChild = fixture.debugElement.query(By.directive(MockPetFormComponent)).componentInstance;
//     mockChild.formGroupChange.emit(mockForm);

//     expect(component.petFormGroup).toBe(mockForm);
//   });

//   // Click onEdit button and call service function with panel id
//   it('should open the slide panel when onEdit is called', () => {
//     const panelId = CommonConstants.PET_FORM;
//     const openSpy = spyOn(slidePanelService, 'open');
  
//     component.onEdit(panelId);
  
//     expect(openSpy).toHaveBeenCalledWith(panelId);
//   });

//   // When the form is invalid, return false
//   it('should update formValid when child emits formValidityChange', () => {
//     component.formValid = false;

//     // check canPanelClose return false
//     expect(component.canPanelClose).toBeFalse();
    
//     // Not called service function to edit
//     expect(petProfileService.editPetData).not.toHaveBeenCalled();
//   });

//   // When the form is valid with allergies, return true
//   it('should update formValid when child emits formValidityChange', () => {
//     // Form validation is true
//     component.formValid = true; 
//     expect(component.canPanelClose).toBeTrue();

//     // Mock received formData 
//     component.petFormGroup = createPetProfileForm(PETS_TEST_DATA[0]);

//     // Check if id was added and send it as PET_FORM_DATA
//     expect(petProfileService.editPetData).toHaveBeenCalledWith(PETS_TEST_DATA[0]);

//     // check canPanelClose return true;
//     expect(component.canPanelClose()).toBeTrue();
    
//   });

//   // When the form is valid without allergies, updated allergies, return true
//   it('should update formValid when child emits formValidityChange', () => {
//     // Form validation is true
//     component.formValid = true; 
//     expect(component.canPanelClose).toBeTrue();

//     // Mock received formData with allergies are empty
//     const initialData = PETS_TEST_DATA[0];
//     initialData.allergies = '';
//     component.petFormGroup = createPetProfileForm(initialData);

//     // Mock expected formData with allergies
//     const expectedData = PETS_TEST_DATA[0];
//     expectedData.allergies = 'none'

//     // Check if id was added and send it as PET_FORM_DATA
//     expect(petProfileService.editPetData).toHaveBeenCalledWith(expectedData);

//     // check canPanelClose return true;
//     expect(component.canPanelClose()).toBeTrue();
    
//   });
// });
