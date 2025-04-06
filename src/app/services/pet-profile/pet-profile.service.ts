import { Injectable } from '@angular/core';
import { PETS_TEST_DATA } from '../../utils/pets-test-data';
import { Observable, of, throwError } from 'rxjs';
import { PetFormData, PetProfile } from '../../components/pet-profile/models/pet-profile.model';

@Injectable({
  providedIn: 'root'
})
export class PetProfileService {

  // fetch pet data by pet id
  getPetByPetId(id: number): Observable<PetProfile> {
    
    // TODO: connect to backend
    const pet = PETS_TEST_DATA.find((item) => item.id === id);
    
    if (!pet) {
      return throwError(() => new Error(`Pet not found with ID: ${id}`));
    }

    //  to simulate async behavior
    return of(pet);
  }

  // getPetsByUserId(id: number): Pet_Profile[] {

  // }

  // Update pet data
  editPetData(petProfileData: PetFormData){
    // TODO
    console.log(petProfileData);
  }
}
