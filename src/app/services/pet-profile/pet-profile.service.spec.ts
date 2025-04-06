import { TestBed } from '@angular/core/testing';
import { PetProfileService } from './pet-profile.service';
import { GoalType, PetSpecies } from '../../pet-profile/models/pet-profile.model';


describe('PetProfileService', () => {
  let petProfileService: PetProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetProfileService,
      ]
    });

    petProfileService = TestBed.inject(PetProfileService);
  });

  it ('should be created', () => {
    expect(petProfileService).toBeTruthy();
  });

  it ('should retrieve pet profile by id', (done) => {
    petProfileService.getPetByPetId(0).subscribe(profile => {
      expect(profile).toBeTruthy("No pet profile returned.");
      expect(profile.id).toBe(0);
      done(); // important to signal async completion
    });
  })

  it('should throw error for invalid pet id', (done) => {
    petProfileService.getPetByPetId(999).subscribe({
      next: () => {
        // make sure the method doesn't return a value
        fail('Expected error but got success');
      },
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toContain('Pet not found with ID: 999');
        done();
      }
    });
  });

  it('should process pet data updates', () => {
    // Spy on console.log to verify it's called with our test data
    spyOn(console, 'log');
    
    // Create test form data
    const testFormData = {
      id: 1,
      species: PetSpecies.CAT,
      name: 'Test Cat',
      icon: 'cat.png',
      birthday: new Date(),
      weight: 10,
      weight_unit: 'kg',
      allergies: 'None',
      medications: [],
      goal: GoalType.MAINTAIN,
      target_weight: 10,
      target_weight_unit: 'kg',
      factor: 1.0,
      daily_calories: 350,
      notes: 'Test notes'
    };
    
    // Call the method
    petProfileService.editPetData(testFormData);
    
    // Verify console.log was called with our test data
    expect(console.log).toHaveBeenCalledWith(testFormData);
  });
});
