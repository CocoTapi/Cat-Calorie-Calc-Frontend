import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface SELECTION {
  value: string;
} 

@Component({
  selector: 'app-custom-selection',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
  templateUrl: './custom-selection.component.html',
  styleUrl: './custom-selection.component.scss'
})

export class CustomSelectionComponent {
  @Input({ required: true }) label!: string;

  @Input({ required: true }) formFieldName!: string;

  @Input({ required: true }) selectedValue!: string;

  @Input({ required: true }) selectionArr!: SELECTION[];
}
