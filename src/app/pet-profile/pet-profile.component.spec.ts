import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { DebugElement } from "@angular/core";
import { PetProfileComponent } from './pet-profile.component';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { PetFormComponent } from './pet-form/pet-form.component';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { of } from 'rxjs';
import { Pet_Profile } from './models/pet-profile.model';

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

      // el = fixture.debugElement;
  });

  it ('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it ('should compute image path after observable emits', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(PETS_TEST_DATA[0]));

    fixture.detectChanges();
    tick(); // resolve observable
    expect(component.imagePath()).toBe('pets/dodger.png');
  }));

  // icon is undefined
  it ('should display default icon when icon is undefined', fakeAsync(() => {
    petProfileService.getPetByPetId.and.returnValue(of(undefined as unknown as Pet_Profile))

    // re-create the component for error case.
    fixture = TestBed.createComponent(PetProfileComponent); 
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();

    expect(component.imagePath()).toBe('pets/paw.png');
  }));

  


});
