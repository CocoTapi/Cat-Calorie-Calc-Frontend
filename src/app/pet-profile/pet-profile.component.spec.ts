import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PetProfileComponent } from './pet-profile.component';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { of } from 'rxjs';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { CommonConstants } from '../app.constants';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { Pet_Profile } from './models/pet-profile.model';

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
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));
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
    tick(); // flush observable
    fixture.detectChanges();

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
    
    createComponent();
    tick(); // flush observable
    fixture.detectChanges();

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
    
    // Need this for fakeAsync 
    fixture = TestBed.createComponent(PetProfileComponent);
    component = fixture.componentInstance; 

    fixture.detectChanges(); // initializes the component
    tick();                  // flush the observable emission
    fixture.detectChanges(); // ensures computed signals re-evaluate
   

    expect(component.imagePath()).toBe('pets/dodger.png');
  }));

  // Get age data successfully
  it ('should compute image path after observable emits', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    fixture.detectChanges(); 
    tick();                  
    fixture.detectChanges();

    expect(component.age()).toBe(11);
  }));

});

// No image data and set default img
// it ('should compute default image path', fakeAsync(() => {
//   petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile));
  
//   // Need this for fakeAsync 
//   fixture = TestBed.createComponent(PetProfileComponent);
//   component = fixture.componentInstance; 

//   fixture.detectChanges(); // initializes the component
//   tick();                  // flush the observable emission
//   fixture.detectChanges(); // ensures computed signals re-evaluate
 

//   expect(component.imagePath()).toBe('pets/paw.png');
// }));





//   // No age data received 
//   it('should compute default image path when no pet data is received', fakeAsync(() => {
//     petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
//     fixture.detectChanges();
//     tick(); 
  
//     // fallback/default
//     expect(component.age()).toBe(0); 
//   }));

//    // Graph title with user data 
//    it ('should compute image path after observable emits', fakeAsync(() => {
//     petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

//     fixture.detectChanges();
//     tick(); // resolve observable

//     expect(component.graphTitle()).toBe("Goal: Lose Weight to 16 lb");
//   }));

//   // Graph title when user data is missing
//   it('should compute default image path when no pet data is received', fakeAsync(() => {
//     petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
//     fixture.detectChanges();
//     tick(); 
  
//     // fallback/default
//     expect(component.graphTitle()).toBe("Goal: Lose Weight"); 
//   }));


//   // ----- edit form -----

//   // Receive child data and set validation
//   it('should update formValid when child emits formValidityChange', () => {
//     const mockChild = fixture.debugElement.query(
//       By.directive(MockPetFormComponent)).componentInstance;

//     mockChild.formValidityChange.emit(true);

//     expect(component.formValid).toBeTrue();
//   });

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
