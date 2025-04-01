import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PetProfileComponent } from './pet-profile.component';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { PetFormComponent } from './pet-form/pet-form.component';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { of } from 'rxjs';
import { Pet_Profile } from './models/pet-profile.model';
import { Component, EventEmitter, Output, } from '@angular/core';
import { By } from '@angular/platform-browser';
import { createPetProfileForm } from './pet-form/pet-profile-form';
import { CommonConstants } from '../app.constants';

@Component({
  selector: 'app-pet-form',
  template: ''
})
class MockPetFormComponent {
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() formGroupChange = new EventEmitter<FormGroup>();
}

describe('PetProfileComponent', () => {
  let component: PetProfileComponent;
  let fixture: ComponentFixture<PetProfileComponent>;
  // let el: DebugElement;
  let petProfileService: jasmine.SpyObj<PetProfileService>;
  let slidePanelService: jasmine.SpyObj<SlidePanelService>;

  beforeEach(async () => {
    petProfileService = jasmine.createSpyObj(
      'PetProfileService', [
        'getPetByPetId'
      ]
    );
    slidePanelService = jasmine.createSpyObj(
      'SlidePanelService', [
        'canClose', 'open'
      ]
    ); 

    await TestBed.configureTestingModule({
      imports: [
        PetProfileComponent,
        PetFormComponent,
        SlidePanelComponent,
        CardComponent,
        MatIconModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: PetProfileService, 
          useValue: petProfileService
        },
        {
          provide: SlidePanelService, 
          useValue: slidePanelService
        }
      ]
    })
    .compileComponents();
      fixture = TestBed.createComponent(PetProfileComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });

  it ('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ------ pet data fetch and set ------

  // Data fetched and set data successfully.
  it('should get pet data by pet id', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    fixture.detectChanges();
    tick(); 

    expect(() => component.pet()).toBe(PETS_TEST_DATA[0]);
    
  }))

   // Data fetch failed and set pet failed
   it('should get pet data by pet id', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile));
    
    fixture.detectChanges();
    tick();

    expect(() => component.pet()).toThrowError('Pet not loaded yet or failed to load.');
  }))

  // ------ ngAfterViewInit ------
  it('should register canClose callback with slidePanelService on ngAfterViewInit', () => {
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

    fixture.detectChanges();
    tick(); // resolve observable

    expect(component.imagePath()).toBe('pets/dodger.png');
  }));

  // imagePath check: no data received 
  it('should compute default image path when no pet data is received', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
    fixture.detectChanges();
    tick(); 
  
    // fallback/default
    expect(component.imagePath()).toBe('pets/paw.png'); 
  }));


  // Get age data successfully
  it ('should compute image path after observable emits', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    fixture.detectChanges();
    tick(); // resolve observable

    expect(component.age()).toBe(11);
  }));

  // No age data received 
  it('should compute default image path when no pet data is received', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
    fixture.detectChanges();
    tick(); 
  
    // fallback/default
    expect(component.age()).toBe(0); 
  }));

   // Graph title with user data 
   it ('should compute image path after observable emits', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    fixture.detectChanges();
    tick(); // resolve observable

    expect(component.graphTitle()).toBe("Goal: Lose Weight to 16 lb");
  }));

  // Graph title when user data is missing
  it('should compute default image path when no pet data is received', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile)); 
  
    fixture.detectChanges();
    tick(); 
  
    // fallback/default
    expect(component.graphTitle()).toBe("Goal: Lose Weight"); 
  }));


  // ----- edit form -----

  // Receive child data and set validation
  it('should update formValid when child emits formValidityChange', () => {
    const mockChild = fixture.debugElement.query(
      By.directive(MockPetFormComponent)).componentInstance;

    mockChild.formValidityChange.emit(true);

    expect(component.formValid).toBeTrue();
  });

  // Receive child data and set petFormGroup
  it('should update petFormGroup when child emits formGroupChange', () => {
    const mockForm = new FormGroup({
      name: new FormControl('Dodger'),
      age: new FormControl(11)
    });

    const mockChild = fixture.debugElement.query(By.directive(MockPetFormComponent)).componentInstance;
    mockChild.formGroupChange.emit(mockForm);

    expect(component.petFormGroup).toBe(mockForm);
  });

  // Click onEdit button and call service function with panel id
  it('should open the slide panel when onEdit is called', () => {
    const panelId = CommonConstants.PET_FORM;
    const openSpy = spyOn(slidePanelService, 'open');
  
    component.onEdit(panelId);
  
    expect(openSpy).toHaveBeenCalledWith(panelId);
  });

  // When the form is invalid, return false
  it('should update formValid when child emits formValidityChange', () => {
    component.formValid = false;

    // check canPanelClose return false
    expect(component.canPanelClose).toBeFalse();
    
    // Not called service function to edit
    expect(petProfileService.editPetData).not.toHaveBeenCalled();
  });

  // When the form is valid with allergies, return true
  it('should update formValid when child emits formValidityChange', () => {
    // Form validation is true
    component.formValid = true; 
    expect(component.canPanelClose).toBeTrue();

    // Mock received formData 
    component.petFormGroup = createPetProfileForm(PETS_TEST_DATA[0]);

    // Check if id was added and send it as PET_FORM_DATA
    expect(petProfileService.editPetData).toHaveBeenCalledWith(PETS_TEST_DATA[0]);

    // check canPanelClose return true;
    expect(component.canPanelClose()).toBeTrue();
    
  });

  // When the form is valid without allergies, updated allergies, return true
  it('should update formValid when child emits formValidityChange', () => {
    // Form validation is true
    component.formValid = true; 
    expect(component.canPanelClose).toBeTrue();

    // Mock received formData with allergies are empty
    const initialData = PETS_TEST_DATA[0];
    initialData.allergies = '';
    component.petFormGroup = createPetProfileForm(initialData);

    // Mock expected formData with allergies
    const expectedData = PETS_TEST_DATA[0];
    expectedData.allergies = 'none'

    // Check if id was added and send it as PET_FORM_DATA
    expect(petProfileService.editPetData).toHaveBeenCalledWith(expectedData);

    // check canPanelClose return true;
    expect(component.canPanelClose()).toBeTrue();
    
  });
});
