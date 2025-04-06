import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomInputComponent } from './custom-input.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnlyTouchedErrorStateMatcher } from '../../utils/only-touched-error-state-matcher';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    // Create form group for testing
    formGroup = new FormGroup({
      testField: new FormControl('')
    });

    await TestBed.configureTestingModule({
      imports: [
        CustomInputComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ErrorStateMatcher, useClass: OnlyTouchedErrorStateMatcher }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.label = 'Test Label';
    component.formFieldName = 'testField';
    component.type = 'text';
    component.placeholder = 'Test placeholder';
    component.customFormControl = formGroup.get('testField') as FormControl;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have an error state matcher', () => {
    expect(component.errorStateMatcher).toBeInstanceOf(OnlyTouchedErrorStateMatcher);
  });
});
