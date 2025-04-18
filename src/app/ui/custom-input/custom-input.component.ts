import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-input',
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) formFieldName!: string;

  @Input({ required: true }) type!: string;
  @Input({ required: true }) customFormControl!: FormControl;
  @Input({ required: true }) placeholder!: string;

  @Input() customErrorMessage: string | undefined;
  
  // Use the globally provided ErrorStateMatcher
  constructor(public errorStateMatcher: ErrorStateMatcher) {}
}
