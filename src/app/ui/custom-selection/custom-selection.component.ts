import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorStateMatcher } from '@angular/material/core';

export interface SELECTION {
  value: string;
  viewValue: string;
} 

@Component({
  selector: 'app-custom-selection',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './custom-selection.component.html',
  styleUrl: './custom-selection.component.scss'
})

export class CustomSelectionComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) formFieldName!: string;  
  @Input({ required: true }) selectFormControl!: FormControl;  
  @Input({ required: true }) selectionArr!: SELECTION[];
  
  // Use the globally provided ErrorStateMatcher
  constructor(public errorStateMatcher: ErrorStateMatcher) {}
}
