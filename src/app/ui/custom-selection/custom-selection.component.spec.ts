import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSelectionComponent } from './custom-selection.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorStateMatcher } from '@angular/material/core';
import { OnlyTouchedErrorStateMatcher } from '../../utils/only-touched-error-state-matcher';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatePipeMock } from '../../utils/translatePipeMock';

describe('CustomSelectionComponent', () => {
  let component: CustomSelectionComponent;
  let fixture: ComponentFixture<CustomSelectionComponent>;
  let formGroup: FormGroup;

  beforeEach(async () => {
    // Create form group for testing
    formGroup = new FormGroup({
      testSelect: new FormControl('')
    });

    await TestBed.configureTestingModule({
      imports: [
        CustomSelectionComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(), 
        TranslatePipeMock
      ],
      providers: [
        { provide: ErrorStateMatcher, useClass: OnlyTouchedErrorStateMatcher },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSelectionComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.label = 'Test Select';
    component.formFieldName = 'testSelect';
    component.selectionArr = [
      { value: 'option1', viewValue: 'Option 1' },
      { value: 'option2', viewValue: 'Option 2' }
    ];
    component.selectFormControl = formGroup.get('testSelect') as FormControl;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have an error state matcher', () => {
    expect(component.errorStateMatcher).toBeInstanceOf(OnlyTouchedErrorStateMatcher);
  });
});
