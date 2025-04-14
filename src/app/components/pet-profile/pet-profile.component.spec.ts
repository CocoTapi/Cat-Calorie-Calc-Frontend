import { ComponentRef, NO_ERRORS_SCHEMA, DebugElement, signal } from "@angular/core";
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { of, throwError } from "rxjs";
import { CommonConstants } from "../../app.constants";
import { PetProfileService } from "../../services/pet-profile/pet-profile.service";
import { PETS_TEST_DATA, PET_TEST_FORM_DATA } from "../../utils/pets-test-data";
import { DisplayAge, PetProfile } from "./models/pet-profile.model";
import { PetProfileComponent } from "./pet-profile.component";
import { calcMonthYear } from "../../utils/util";
import { TranslateModule } from "@ngx-translate/core";
import { TranslatePipeMock } from "../../utils/translatePipeMock";



describe('PetProfileComponent', () => {
  let component: PetProfileComponent
  let componentRef: ComponentRef<PetProfileComponent>
  let fixture: ComponentFixture<PetProfileComponent>

  // Shared mock service with a spy that we override per test
  const petProfileService = {
    getPetByPetId: jasmine.createSpy('getPetByPetId'),
    editPetData: jasmine.createSpy('editPetData'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PetProfileComponent,
        TranslateModule.forRoot(), 
        TranslatePipeMock
      ],
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
  function setData(returnedData: PetProfile) {
    componentRef.setInput('id', '0');
    petProfileService.getPetByPetId.and.returnValue(of(returnedData));

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


  // Fetch data with pet id failed
  it('should handle error from getPetByPetId', fakeAsync(() => {
    componentRef.setInput('id', '0');
    const consoleSpy = spyOn(console, 'error');
    petProfileService.getPetByPetId.and.returnValue(throwError(() => new Error('Mock error')));

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('Error loading pet:', jasmine.any(Error));
    expect(component['_pet']()).toBeUndefined();
  }));

  // Test subscription cleanup
  it('should register unsubscribe handler with destroyRef', () => {
    componentRef.setInput('id', '0');
    // Spy on DestroyRef.onDestroy
    const onDestroySpy = spyOn(component['destroyRef'], 'onDestroy');
    // Mock the getPetByPetId to return an observable
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    // Initialize the component
    component.ngOnInit();

    // Verify onDestroy was called with a function
    expect(onDestroySpy).toHaveBeenCalled();
    expect(typeof onDestroySpy.calls.mostRecent().args[0]).toBe('function');
  });

  // Error for compute pet()
  it('should throw when pet is not loaded', () => {
    // Set _pet to return undefined
    component['_pet'] = signal<undefined>(undefined);

    expect(() => component.pet()).toThrowError('Pet not loaded yet or failed to load.');
  });


  // ------ pet data fetch and set ------

  // ----- IMAGE PATH -----

  // User setup img and display on the screen
  it("should display custom image", fakeAsync(() => {
    const customData = { ...PETS_TEST_DATA[0] };
    // Ensure icon is properly set
    customData.icon = 'dodger.png';
    setData(customData);

    const mockPath = 'pets/' + customData.icon;

    tick()

    // Access signal directly
    expect(component.imagePath()).toBe(mockPath);
  }));

  // User hasn't set icon and display default icon
  it("should display default image", fakeAsync(() => {
    const newIconData = PETS_TEST_DATA[0];
    newIconData.icon = ''
    setData(newIconData);

    const mockPath = 'pets/paw.png'

    tick();

    // Access signal directly
    expect(component.imagePath()).toBe(mockPath);
  }));


  // ----- AGE -----

  // Data fetch failed and keep pet() undefined.
  it('should get pet age', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);

    // Calculate the expected age dynamically based on the current date
    const birthday = PETS_TEST_DATA[0].birthday;
    const expectedAge = calcMonthYear(birthday)
    tick();

    expect(component.age()).toEqual(expectedAge);
  }))

  // Pet is less than 1 year old
  it('should get pet age (less than 1 year old)', fakeAsync(() => {
    const petData = PETS_TEST_DATA[0];
    petData.birthday = new Date();
    setData(petData);

    const mockAge: DisplayAge = { months: 0, years: 0 };

    tick();

    expect(component.age()).toEqual(mockAge);
  }))

  // ----- GRAPH TITLE -----

  // User's goal are lose weight or gain weight
  it('should display title for user goal', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // Explicitly set goal and weights to ensure test consistency
    mockData.goal = 'Lose'
    mockData.weight = 20;
    mockData.target_weight = 16;
    mockData.weight_unit = 'lb';

    const mockTitle = `Goal: ${mockData.goal} Weight to ${mockData.target_weight} ${mockData.weight_unit}`;

    setData(mockData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle);
  }))

  // Test case for default weight unit
  it('should use default weight unit when unit is missing', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    mockData.goal = 'Lose'
    mockData.weight = 20;
    mockData.target_weight = 16;
    // Force undefined weight_unit
    Object.defineProperty(mockData, 'weight_unit', {
      value: undefined,
      configurable: true
    });

    const mockTitle = `Goal: Lose Weight to 16 lb`; // Default unit is lb

    setData(mockData);
    tick();

    expect(component.graphTitle()).toBe(mockTitle);
  }));

  // User's goal are maintain
  it('should display title for maintain', fakeAsync(() => {
    const newUserGoalData = PETS_TEST_DATA[0]
    newUserGoalData.goal = 'Maintain';

    const mockTitle = `Goal: Maintain Weight`

    setData(newUserGoalData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle);
  }))

  // Check if isGoalCorrect is set to false when the goal doesn't match the weights
  it('should set isGoalCorrect to false when goal is incorrect (gain vs lose)', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // Target weight is less than current weight but goal is set to Gain (incorrect)
    mockData.weight = 20;
    mockData.target_weight = 16;
    mockData.goal = 'Gain'; // This is wrong, should be Lose

    setData(mockData);
    tick();

    // Check the signal value directly
    expect(component.isGoalCorrect()).toBe(false);
  }));

  // Check if isGoalCorrect is set to false when the goal doesn't match the weights (lose vs gain)
  it('should set isGoalCorrect to false when goal is incorrect (lose vs gain)', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // Target weight is more than current weight but goal is set to Lose (incorrect)
    mockData.weight = 15;
    mockData.target_weight = 20;
    mockData.goal = 'Lose'; // This is wrong, should be Gain  

    setData(mockData);
    tick();

    // Check the signal value directly
    expect(component.isGoalCorrect()).toBe(false);
  }));

  // Check if isGoalCorrect is true when goal matches the weights
  it('should set isGoalCorrect to true when goal is correct', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // Target weight is less than current weight and goal is set to Lose (correct)
    mockData.weight = 20;
    mockData.target_weight = 16;
    mockData.goal = 'Lose'; // This is correct

    setData(mockData);
    tick();

    // Check the signal value directly
    expect(component.isGoalCorrect()).toBe(true);
  }));

  // User's target weight and current weight are same so display Maintain
  it('should display title for maintain based on weight', fakeAsync(() => {
    const mockGoalData = PETS_TEST_DATA[0]
    mockGoalData.weight = 10;
    mockGoalData.target_weight = 10;

    const mockTitle = `Goal: Maintain Weight`

    setData(mockGoalData);

    tick();

    expect(component.graphTitle()).toBe(mockTitle);
  }))

  // Check if isGoalCorrect is true when goal is set to Maintain
  it('should set isGoalCorrect to true when goal is Maintain', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // Even with inconsistent weights, goal of Maintain should always be valid
    mockData.weight = 20;
    mockData.target_weight = 16;
    mockData.goal = 'Maintain';

    setData(mockData);
    tick();

    // Check the signal value directly
    expect(component.isGoalCorrect()).toBe(true);
  }));

  // Check if isGoalCorrect is true when weights are equal
  it('should set isGoalCorrect to true when weights are equal', fakeAsync(() => {
    const mockData = { ...PETS_TEST_DATA[0] };
    // When weights are equal, any goal should be considered valid
    mockData.weight = 16;
    mockData.target_weight = 16;
    mockData.goal = 'Lose'; // Normally incorrect for equal weights, but special cased

    setData(mockData);
    tick();

    // Check the signal value directly
    expect(component.isGoalCorrect()).toBe(true);
  }));

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
    component.panelId = CommonConstants.PET_FORM;
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
    const mockFormData = PETS_TEST_DATA[0];
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
  it('should handle empty allergies correctly', fakeAsync(() => {
    setData(PETS_TEST_DATA[0]);
    component.formValid = true;

    // Mock form data with empty allergies
    const mockFormData = PETS_TEST_DATA[0];
    mockFormData.allergies = '';

    // Build a form group that returns the mock data as value
    component.petFormGroup = new FormBuilder().group(mockFormData);

    // mock petProfileService
    const editPetDataSpy = component['petProfileService'].editPetData;

    const result = component.canPanelClose();

    const expectedData = { ...mockFormData, allergies: '', id: 0 };
    expect(editPetDataSpy).toHaveBeenCalledWith(expectedData);
    expect(result).toBeTrue();
  }));

})




