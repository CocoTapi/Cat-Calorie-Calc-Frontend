import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-btn-toggle',
  standalone: true,
  imports: [MatButtonToggleModule, ReactiveFormsModule],
  templateUrl: './btn-toggle.component.html',
  styleUrl: './btn-toggle.component.scss'
})
export class BtnToggleComponent implements OnInit {
  @Input({ required: true }) formFieldName!: string;
  
  @Input({ required: true }) val1!: string;
  @Input({ required: true }) val2!: string;
  
  @Input() ariaLabel?: string;
  
  @Input() parentForm!: FormGroup;
  
  // Extracted control for the template
  control!: FormControl;
  
  ngOnInit() {
    // Get the control from the parent form
    this.control = this.parentForm.get(this.formFieldName) as FormControl;
    if (!this.control) {
      throw new Error(`Form control with name ${this.formFieldName} not found in parent form`);
    }
  }
}
