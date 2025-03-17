import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-btn-toggle',
  standalone: true,
  imports: [MatButtonToggleModule, ReactiveFormsModule],
  templateUrl: './btn-toggle.component.html',
  styleUrl: './btn-toggle.component.scss'
})
export class BtnToggleComponent {
  // TODO: search how to pass arial-label
    @Input({ required: true }) formFieldName!: string;
  
    @Input({ required: true }) val1!: string;
    @Input({ required: true }) val2!: string;

    // @Input({ required: true }) customFormControl!: FormControl;
}
