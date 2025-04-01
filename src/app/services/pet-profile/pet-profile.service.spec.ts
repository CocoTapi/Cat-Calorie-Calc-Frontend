import { TestBed } from '@angular/core/testing';
import { PetProfileService } from './pet-profile.service';


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


});
