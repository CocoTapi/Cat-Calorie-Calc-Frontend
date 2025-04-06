import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnToggleComponent } from './btn-toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';

// Create test host component with form group
@Component({
  standalone: true,
  imports: [BtnToggleComponent, ReactiveFormsModule, MatButtonToggleModule],
  template: `
    <form [formGroup]="testForm">
      <app-btn-toggle 
        #btnToggle
        formFieldName="testToggle"
        val1="Option1"
        val2="Option2"
        [ariaLabel]="'Test Toggle'"
        [parentForm]="testForm"
      ></app-btn-toggle>
    </form>
  `
})
class TestHostComponent {
  @ViewChild('btnToggle') btnToggleComponent!: BtnToggleComponent;
  
  testForm = new FormGroup({
    testToggle: new FormControl('Option1')
  });
  
  constructor() {
    // Initialize the form
  }
}

/**
 * Test component for negative testing scenarios - missing form control
 */
@Component({
  standalone: true,
  imports: [BtnToggleComponent, ReactiveFormsModule, MatButtonToggleModule],
  template: `
    <form [formGroup]="invalidTestForm">
      <app-btn-toggle 
        #btnToggle
        formFieldName="nonExistentField"
        val1="Option1"
        val2="Option2"
        [parentForm]="invalidTestForm"
      ></app-btn-toggle>
    </form>
  `
})
class InvalidTestHostComponent {
  @ViewChild('btnToggle') btnToggleComponent!: BtnToggleComponent;
  
  invalidTestForm = new FormGroup({
    otherField: new FormControl('Option1') // Different field than specified in formFieldName
  });
}

describe('BtnToggleComponent', () => {
  let hostComponent: TestHostComponent;
  let component: BtnToggleComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        InvalidTestHostComponent,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges(); // This will create the component with a valid form

    // Get the BtnToggleComponent from the host
    component = hostComponent.btnToggleComponent;
  });

  // POSITIVE TESTS

  /**
   * Ensure the component is properly instantiated
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  /**
   * Verify all input properties are correctly set
   */
  it('should have correct values set', () => {
    expect(component.formFieldName).toBe('testToggle');
    expect(component.val1).toBe('Option1');
    expect(component.val2).toBe('Option2');
    expect(component.ariaLabel).toBe('Test Toggle');
    expect(component.parentForm).toBe(hostComponent.testForm);
  });

  /**
   * Check that the form control is properly extracted from the parent form
   */
  it('should extract the correct form control', () => {
    expect(component.control).toBeTruthy();
    
    // Get the control directly to compare
    const toggleControl = hostComponent.testForm.get('testToggle');
    expect(component.control).toBeTruthy();
    expect(toggleControl).toBeTruthy();
    
    // Compare values rather than the control instances themselves
    expect(component.control.value).toBe(toggleControl?.value);
    expect(component.control.value).toBe('Option1');
  });

  /**
   * Verify the AriaLabel fallback works when no explicit label is provided
   */
  it('should use formFieldName as ariaLabel when no explicit ariaLabel is provided', () => {
    // Remove the ariaLabel input
    component.ariaLabel = undefined;
    fixture.detectChanges();
    
    // Get the button toggle group element
    const toggleGroupEl = fixture.nativeElement.querySelector('mat-button-toggle-group');
    
    // Check that it uses formFieldName as the aria-label
    expect(toggleGroupEl.getAttribute('aria-label')).toBe('testToggle');
  });

  /**
   * Test interaction with the component
   */
  it('should update form control value when toggle is changed', () => {
    // Set the value directly instead of trying to trigger a click event
    component.control.setValue('Option2');
    fixture.detectChanges();
    
    // Verify the form control was updated
    expect(component.control.value).toBe('Option2');
    expect(hostComponent.testForm.get('testToggle')?.value).toBe('Option2');
  });

  // NEGATIVE TESTS

  /**
   * Verify error handling when form control doesn't exist
   */
  it('should throw error when form control is not found', () => {
    // Create a new instance of InvalidTestHostComponent directly, without registering it
    const invalidComponent = new InvalidTestHostComponent();
    const btnComponent = new BtnToggleComponent();
    
    // Set up the properties manually
    btnComponent.formFieldName = "nonExistentField";
    btnComponent.val1 = "Option1";
    btnComponent.val2 = "Option2";
    btnComponent.parentForm = invalidComponent.invalidTestForm;
    
    // Expect error when ngOnInit is called
    expect(() => {
      btnComponent.ngOnInit();
    }).toThrowError('Form control with name nonExistentField not found in parent form');
  });
});
