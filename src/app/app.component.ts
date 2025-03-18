import { Component, OnInit } from '@angular/core';
import { SlidePanelComponent } from './ui/slide-panel/slide-panel.component';
import { SlidePanelService } from './services/slide-panel/slide-panel.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [SlidePanelComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cat-calorie-calc-frontend';
  constructor(private slidePanelService: SlidePanelService) {}
  myForm!: FormGroup;

  pet = { name: 'Dodger'}

  ngOnInit(): void {
    const initialProfile = { name: this.pet.name }

    this.myForm = new FormGroup({
      name: new FormControl(initialProfile.name),
    });

    this.slidePanelService.onClose(() => this.onSubmit());
  }

  openPanel(){
    this.slidePanelService.open();
  }

  onSubmit(){
    this.pet.name = this.myForm.value.name;
    console.log('Form Submitted:', this.pet);
  }
}
