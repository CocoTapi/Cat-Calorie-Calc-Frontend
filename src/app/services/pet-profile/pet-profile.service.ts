import { Injectable } from '@angular/core';
import { PETS_TEST_DATA } from '../../../../public/pets/pets-test-data';
import { Pet_Profile } from '../../pet-profile/models/pet-profile.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetProfileService {
  getPetById(id: number): Observable<Pet_Profile> {
    
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
}
