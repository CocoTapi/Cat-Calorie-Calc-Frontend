import { Component, computed, inject, signal, input, AfterViewInit } from '@angular/core';
import { PetProfileService } from '../services/pet-profile/pet-profile.service';
import { PetFormComponent } from "./pet-form/pet-form.component";
import { MatIconModule } from '@angular/material/icon';
import { SlidePanelService } from '../services/slide-panel/slide-panel.service';
import { SlidePanelComponent } from '../ui/slide-panel/slide-panel.component';
import { CardComponent } from '../ui/card/card.component';
import { CommonConstants } from '../app.constants';
import { FormGroup } from '@angular/forms';
import { Pet_Form_Data } from './models/pet-profile.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';


@Component({
  selector: 'app-pet-profile',
 imports: [PetFormComponent, MatIconModule, SlidePanelComponent, CardComponent],
  templateUrl: './pet-profile.component.html',
  styleUrl: './pet-profile.component.scss'
})
export class PetProfileComponent implements AfterViewInit {
  id = input<number>(0);
  panelId: string = CommonConstants.PET_FORM;

  private petProfileService = inject(PetProfileService);
  private slidePanelService = inject(SlidePanelService);

  formValid: boolean = false;
  petFormGroup!: FormGroup;

  ngAfterViewInit(): void {
    // Register canClose condition for the 'form' panel
    this.slidePanelService.canClose(this.panelId, () => this.canPanelClose());
  }


  showEditPage = signal(false);

  // handle Observable as signal
  pet = toSignal(
    this.petProfileService.getPetById(this.id()).pipe(
      catchError((error) => {
        console.error('Error fetching pet:', error);
        return of(undefined); // fallback so toSignal doesn’t break
      })
    ), 
    {
      initialValue: undefined,
    }
  );

  imagePath = computed(() => {
    const icon = 'pets/' + this.pet()?.icon;
    return icon ? icon : 'pets/paw.png';
  });

  age = computed(() => {
    const birthday = this.pet()?.birthday;
    if(!birthday) return 0;

    const today = new Date();
    let age = today.getFullYear() - birthday!.getFullYear();
    const monthDiff = today.getMonth() - birthday!.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday!.getDate())) {
      age--; 
    }

    return age;
  });

  graphTitle = computed(() => {
    let title = `Goal: ${this.pet()?.goal} weight`;

    if (this.pet()?.target_weight) {
      title = `Goal: ${this.pet()?.goal} Weight to ${this.pet()?.target_weight} ${this.pet()?.weight_unit}`
    }

    return title;
  });


  // ----- edit form -----
  onFormStatusChanged(valid: boolean) {
    this.formValid = valid;
  }
  
  onFormGroupChanged(form: FormGroup) {
    this.petFormGroup = form;
  }

  onEdit(panelId: string) {
    this.slidePanelService.open(panelId);
  }

  canPanelClose(): boolean {
    if (!this.formValid) {
      console.log(this.formValid);

      // TODO: display validation error to a user 

      return false; // This will prevent closing
    }

    // Submit form
    const formData: Pet_Form_Data = {
          id: this.id(),
          ...this.petFormGroup.value
    }

    if (!formData.allergies.length) {
      formData.allergies = 'none';
    }

    console.log('form submitted by closing the panel', formData);
    return true;
  }
  
}
