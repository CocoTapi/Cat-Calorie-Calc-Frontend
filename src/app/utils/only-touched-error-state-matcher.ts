import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Error state matcher that only shows errors when a field is touched or submitted,
 * not when it's just dirty (as the user is typing).
 */
export class OnlyTouchedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null, 
    form: FormGroupDirective | NgForm | null
  ): boolean {
    // Only show errors when:
    // 1. The field is invalid
    // 2. AND (the field has been touched OR the form has been submitted)
    // This ignores the "dirty" state to prevent errors while typing
    return !!(control && control.invalid && (control.touched || (form && form.submitted)));
  }
} 