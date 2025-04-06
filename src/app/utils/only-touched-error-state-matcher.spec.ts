import { FormControl, FormGroupDirective } from '@angular/forms';
import { OnlyTouchedErrorStateMatcher } from './only-touched-error-state-matcher';

describe('OnlyTouchedErrorStateMatcher', () => {
  let matcher: OnlyTouchedErrorStateMatcher;
  let control: FormControl;

  beforeEach(() => {
    matcher = new OnlyTouchedErrorStateMatcher();
    control = new FormControl('', { validators: [() => ({ 'required': true })] });
  });

  it('should return false when control is pristine and untouched', () => {
    expect(matcher.isErrorState(control, null)).toBe(false);
  });

  it('should return true when control is invalid and touched', () => {
    control.markAsTouched();
    expect(matcher.isErrorState(control, null)).toBe(true);
  });

  it('should return false when control is invalid but only dirty (not touched)', () => {
    control.markAsDirty();
    expect(matcher.isErrorState(control, null)).toBe(false);
  });

  it('should return true when control is invalid and form is submitted', () => {
    const formMock = { submitted: true } as FormGroupDirective;
    expect(matcher.isErrorState(control, formMock)).toBe(true);
  });

  it('should return false when control is valid even if touched', () => {
    const validControl = new FormControl('valid value');
    validControl.markAsTouched();
    expect(matcher.isErrorState(validControl, null)).toBe(false);
  });
}); 