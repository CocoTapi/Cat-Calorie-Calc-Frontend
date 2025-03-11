import { Injectable, signal } from '@angular/core';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';

@Injectable({
  providedIn: 'root'
})
export class PetProfileService {
  private petData = signal(PETS_TEST_DATA[0]); 
  constructor() {
    // TODO: get pet name and the pet data
  }

  pet = this.petData.asReadonly();
}
