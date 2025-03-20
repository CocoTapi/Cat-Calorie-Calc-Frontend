import { Component } from '@angular/core';
// import { SlidePanelComponent } from './ui/slide-panel/slide-panel.component';
// import { SlidePanelService } from './services/slide-panel/slide-panel.service';
import { PetProfileComponent } from './pet-profile/pet-profile.component';
import { SlidePanelService } from './services/slide-panel/slide-panel.service';
import { SlidePanelComponent } from './ui/slide-panel/slide-panel.component';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [PetProfileComponent, SlidePanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cat-calorie-calc-frontend';
  constructor(private slidePanelService: SlidePanelService) {}


  openPanel(id: string) {
    this.slidePanelService.open(id);
  }
}
