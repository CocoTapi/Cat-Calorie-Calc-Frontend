import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PetProfileComponent } from './pet-profile.component';
import { ComponentRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { of } from 'rxjs';
import { PET_TEST_FORM_DATA, PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { Pet_Profile } from './models/pet-profile.model';
import { By } from '@angular/platform-browser';
import { CommonConstants } from '../app.constants';
import { FormBuilder } from '@angular/forms';


describe('PetProfileComponent', () => {
  let component: PetProfileComponent
  let componentRef: ComponentRef<PetProfileComponent>
  let fixture: ComponentFixture<PetProfileComponent>
  // const undefinedData = undefined as unknown as Pet_Profile;

  // Shared mock service with a spy that we override per test
  const petProfileService = {
    getPetByPetId: jasmine.createSpy('getPetByPetId'),
    editPetData: jasmine.createSpy('editPetData'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetProfileComponent],
      providers: [
        { provide: PetProfileService, useValue: petProfileService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(PetProfileComponent)

    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  })

  // setup pet profile data
  function setData(returnedData: Pet_Profile) {
    petProfileService.getPetByPetId.and.returnValue(of(returnedData));
    componentRef.setInput('id', '0');
    
    // call ngOninit()
    fixture.detectChanges()
  }

  // Setup child component
  function findComponent<T>(
    fixture: ComponentFixture<T>,
    selector: string,
  ): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  // Setup edit button element
  function setUpEditButton() {
    const editDebugElement = fixture.debugElement.query(By.css('.responsive-icon'));
    const editButton = editDebugElement.nativeElement;

    return editButton;
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
    
    tick();

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


  // ----- edit form -----

  // Check the presence of child component
  it('renders an independent petFormComponent', () => {
    setData(PETS_TEST_DATA[0]);

    // Prepare child component
    const petForm = findComponent(fixture, 'app-pet-form');

    expect(petForm).toBeTruthy();
  });
  
  // Receive form validity data from child component and set validation
  it('should update formValid when child emits formValidityChange', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    const petForm = findComponent(fixture, 'app-pet-form');

    // Simulate Output
    petForm.triggerEventHandler('formValidationChange', true);

    tick();

    expect(component.formValid).toBeTrue();
  }));

  // Receive form data from child component and set the data 
  it('should set edited form data', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    const petForm = findComponent(fixture, 'app-pet-form');
    const mockFormData = PET_TEST_FORM_DATA[0];

    // Simulate Output
    petForm.triggerEventHandler('formGroupData', mockFormData);

    tick();

    expect(component.petFormGroup).toBeTruthy();
  }));

  // Edit button exists. 
  it('render edit button', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);

    const editButton = setUpEditButton();

    expect(editButton).toBeTruthy();
   
  })); 

  // When user click edit button, slidePanelService is called to open edit panel
  it('should be called slidePanelService.open with panel id', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    const panelId = CommonConstants.PET_FORM;
    const slidePanelServiceSpy = spyOn(component['slidePanelService'], 'open');

    component.onEdit(panelId);

    expect(slidePanelServiceSpy).toHaveBeenCalledWith(panelId);
  }));


  // ------ ngAfterViewInit ------
  
  // Panel close and validation check are called
  it('should register canClose callback with slidePanelService on ngAfterViewInit', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    component.panelId =  CommonConstants.PET_FORM;
    const slidePanelServiceSpy = spyOn(component['slidePanelService'], 'canClose');

    // mock canPanelClose to return false
    spyOn(component, 'canPanelClose').and.returnValue(false);

    // Trigger ngAfterViewInit 
    component.ngAfterViewInit();

    // Mock the callback
    const registeredCallback = 
      slidePanelServiceSpy.calls.mostRecent().args[1]
  
    // Simulate the panel trying to close 
    const result = registeredCallback();

    // Expect panel won't close
    expect(result).toBeFalse();
  }));

  // Panel close but form validation was false, return false
  it('should be return false when form is invalid', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    component.formValid = false;
    
    const result = component.canPanelClose();

    expect(result).toBeFalse();
  }));

  // TODO: Panel close and form data updated correctly and return true
  it('should send correct data and return true', fakeAsync(() => {
  setData(PETS_TEST_DATA[0]);
  component.formValid = true;

  // Mock form data
  const mockFormData = PET_TEST_FORM_DATA[0];
  // mockFormData.medications = [];

  // Build a form group that returns the mock data as value
  component.petFormGroup = new FormBuilder().group(mockFormData);

  // mock petProfileService
  const editPetDataSpy = component['petProfileService'].editPetData;
  
  const result = component.canPanelClose();

  expect(editPetDataSpy).toHaveBeenCalledWith(mockFormData);
  expect(result).toBeTrue();
}));

  // Panel close and form data updated correctly and return true (No allergies case)

})
 



    