import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PetProfileComponent } from './pet-profile.component';

import { Component, ComponentRef, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { of } from 'rxjs';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { Pet_Profile } from './models/pet-profile.model';

@Component({
  selector: 'app-pet-form',
  template: '',
  standalone: true
})
export class MockPetFormComponent {
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() formGroupChange = new EventEmitter<FormGroup>();
}


describe('PetProfileComponent', () => {
  let component: PetProfileComponent
  let componentRef: ComponentRef<PetProfileComponent>
  let fixture: ComponentFixture<PetProfileComponent>
  // const undefinedData = undefined as unknown as Pet_Profile;

  // Shared mock service with a spy that we override per test
  const petProfileService = {
    getPetByPetId: jasmine.createSpy('getPetByPetId')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetProfileComponent],
      providers: [
        { provide: PetProfileService, useValue: petProfileService },
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(PetProfileComponent)

    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  })

  function setData(returnedData: Pet_Profile) {
    petProfileService.getPetByPetId.and.returnValue(of(returnedData));
    componentRef.setInput('id', '0');
    
    // call ngOninit()
    fixture.detectChanges()
  }

  // PetProfileService was called with id in ngOnInit
  it('should call the petProfileService when id is set', () => {
    setData(PETS_TEST_DATA[0]);
    
    expect(petProfileService.getPetByPetId).toHaveBeenCalledWith('0');
  })

  // pet data is stored correctly
  it('should store the fetched data correctly', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    const mockName = PETS_TEST_DATA[0].name

    tick();
  
    expect(component.pet().name).toEqual(mockName);
  }));


  // ------ pet data fetch and set ------

  // ----- IMAGE PATH -----

  // User setup img and display on the screen
  it("should display custom image", fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);

    const mockPath = 'pets/' + PETS_TEST_DATA[0].icon;
    
    tick()

    // Access signal directly
    expect(component.imagePath()).toBe(mockPath); 
  }));

   // User hasn't set icon and display default icon
   it("should display default image", fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0];
    mockData.icon = ''
    setData(mockData);

    const mockPath = 'pets/paw.png'
    
    tick()

    // Access signal directly
    expect(component.imagePath()).toBe(mockPath); 
  }));


  // ----- AGE -----

  // Data fetch failed and keep pet() undefined.
  it('should get pet age', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);

    const mockAge = 11;
    
    tick();

    expect(component.age()).toBe(mockAge); 
  }))


  // ----- GRAPH TITLE -----

   // User's goal are lose weight or gain weight
   it('should display title for user goal', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0] 
    const mockGoal = mockData.goal;
    const mockTargetWeight = mockData.target_weight;
    const mockUnit = mockData.weight_unit;

    const mockTitle =  `Goal: ${mockGoal} Weight to ${mockTargetWeight} ${mockUnit}`
    
    setData(mockData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle); 
  }))

  // User's goal are maintain
  it('should display title for maintain', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0] 
    mockData.goal = 'Maintain';

    const mockTitle =  `Goal: Maintain Weight`
    
    setData(mockData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle); 
  }))

   // User's target weight and current weight are same so display Maintain
   it('should display title for maintain based on weight', fakeAsync(() => {
    const mockData = PETS_TEST_DATA[0] 
    mockData.weight = 10;
    mockData.target_weight = 10;

    const mockTitle =  `Goal: Maintain Weight`
    
    setData(mockData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle); 
  }))


})






    



//   // ------ ngAfterViewInit ------
//   it('should register canClose callback with slidePanelService on ngAfterViewInit', () => {
//     petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

//     // Configure TestBed with just this mock
//     TestBed.configureTestingModule({
//       imports: [PetProfileComponent],
//       providers: [
//         { provide: SlidePanelService, useValue: slidePanelService },
//         { provide: PetProfileService, useValue: petProfileService }
//       ]
//     }).compileComponents();

//     // Re-Create the component
//     const fixture = TestBed.createComponent(PetProfileComponent);
//     const component = fixture.componentInstance;

    
//     component.panelId =  CommonConstants.PET_FORM;
    
//     // mock canPanelClose to return false
//     spyOn(component, 'canPanelClose').and.returnValue(false);
  
//     // Trigger the registration logic
//     component.ngAfterViewInit();
  
//     // Get the callback function that was registered with the service
//     const registeredCallback = (
//       slidePanelService.canClose as jasmine.Spy).calls.mostRecent().args[1];
  
//     // Simulate the panel trying to close 
//     const result = registeredCallback();

//     // Expect panel won't close
//     expect(result).toBeFalse();
//   });

    


//   // ----- edit form -----


//   // Receive child data and set validation
//   // it('should update formValid when child emits formValidityChange', fakeAsync(() => {
//   //   // Arrange data
//   //   petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));
//   //   createComponent();
//   //   tick();
//   //   fixture.detectChanges();

//   //   // Setup a child component
//   //   const debugEl = fixture.debugElement.query(By.directive(MockPetFormComponent));
//   //   expect(debugEl).withContext('Child component not found in DOM').not.toBeNull();
  
//   //   const mockChild = debugEl.componentInstance;

//   //   // send validation true from form component
//   //   mockChild.formValidityChange.emit(true);

//   //   expect(component.formValid).toBeTrue();
//   // }));

//   it('should update formValid when child emits formValidityChange', fakeAsync(() => {
//     // Arrange: mock service returns test data
//     petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));
  
//     // Act: create component and trigger lifecycle
//     createComponent();   // assumes this calls TestBed.createComponent and assigns to `component` and `fixture`
//     tick();              // completes any async operations
//     fixture.detectChanges(); // triggers ngOnInit and template render
  
//     // Assert: locate child component after DOM is fully rendered
//     const debugEl = fixture.debugElement.query(By.css('app-pet-form'));
//     expect(debugEl).withContext('app-pet-form not found').not.toBeNull();
  
//     const mockChild = debugEl.componentInstance;
//     mockChild.formValidityChange.emit(true);
//     fixture.detectChanges(); // allow parent to react to output

//     console.log('mockChild', mockChild);


//     expect(component.formValid).toBeTrue();
//   }));

  

// });

 // // Data fetch failed and display default title
  // it('should display only goal without target weight', fakeAsync(() => {
  //   petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
  //   createComponent();
  //   updateCheck();

  //   // fallback/default
  //   expect(component.graphTitle()).toBe("Goal: Maintain Weight"); 
  // }));





 















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
