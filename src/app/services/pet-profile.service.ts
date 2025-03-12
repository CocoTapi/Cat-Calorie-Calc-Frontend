import { Injectable } from '@angular/core';
import { PETS_TEST_DATA } from '../../../public/pets/pets-test-data';
import { Pet_Profile } from '../pet-profile/models/pet-profile.model';

@Injectable({
  providedIn: 'root'
})
export class PetProfileService {
  getPetById(id: number): Pet_Profile {
    // TODO: connect database
    const pet = PETS_TEST_DATA.find((item) => {
     return item.id === id;
    })
    if (!pet) throw new Error (`Pet not found with ID: ${id}`);
    return pet;
  }

  // getPetsByUserId(id: number): Pet_Profile[] {

  // }
}
