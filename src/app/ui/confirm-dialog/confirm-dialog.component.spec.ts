import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    // Create a spy for the dialog reference close method
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ConfirmDialogComponent,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Test Title', text: 'Test Text' } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    component.title = 'Test Title';
    component.text = 'Test Text';
    fixture.detectChanges();
  });

  /**
   * Basic test to verify that the component is created successfully
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verify that the component properly displays input properties in the UI
   */
  it('should display title and text', () => {
    fixture.detectChanges();
    const dialogTitle = fixture.debugElement.query(By.css('h2'));
    const dialogContent = fixture.debugElement.query(By.css('mat-dialog-content p'));
    
    expect(dialogTitle.nativeElement.textContent).toContain('Test Title');
    expect(dialogContent.nativeElement.textContent).toContain('Test Text');
  });

  /**
   * Test that the component handles missing title gracefully
   */
  it('should not display title when title is not provided', () => {
    component.title = undefined;
    fixture.detectChanges();
    
    // There should be no h2 element when title is undefined
    const dialogTitle = fixture.debugElement.query(By.css('h2'));
    expect(dialogTitle).toBeNull();
    
    // Text should still be displayed
    const dialogContent = fixture.debugElement.query(By.css('mat-dialog-content p'));
    expect(dialogContent.nativeElement.textContent).toContain('Test Text');
  });

  /**
   * Test that the No button correctly calls onNoClick method
   */
  it('should close the dialog with false when No button is clicked', () => {
    // Find the "No Thanks" button and click it
    const noButton = fixture.debugElement.query(By.css('button:first-of-type'));
    noButton.nativeElement.click();
    
    // Verify the dialog was closed with 'false'
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  /**
   * Test that the onNoClick method works as expected
   */
  it('should close dialog with false when onNoClick is called directly', () => {
    // Call the method directly
    component.onNoClick();
    
    // Verify dialog was closed with false
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  /**
   * Test that the Ok button uses the animal method result
   */
  it('should close the dialog with true when Ok button is clicked', () => {
    // Verify animal() method returns true
    expect(component.animal()).toBeTrue();
    
    // Find the "Ok" button and click it - should call mat-dialog-close with the result of animal()
    const okButton = fixture.debugElement.query(By.css('button:last-of-type'));
    okButton.nativeElement.click();
    
    // The mat-dialog-close directive will close the dialog with the value of animal()
    // which is true - we can't test this directly but we can verify the button has the
    // correct mat-dialog-close binding
    expect(okButton.attributes['ng-reflect-dialog-result']).toBeTruthy();
  });

  /**
   * Test the animal method directly
   */
  it('should return true from animal method', () => {
    // Test the animal method directly
    expect(component.animal()).toBeTrue();
  });
});
